import "server-only";
import type { ContentFile } from "./cv";

export interface GithubConfig {
  configured: boolean;
  owner?: string;
  repo?: string;
  branch?: string;
  path?: string;
  adminId?: string;
  ghPat?: string;
}

export function getGithubConfig(): GithubConfig {
  const owner = process.env.GH_REPO_OWNER;
  const repo = process.env.GH_REPO_NAME;
  const branch = process.env.GH_BRANCH ?? "main";
  const path = process.env.GH_CONTENT_PATH ?? "data/cv.json";
  const adminId = process.env.CV_ADMIN_ID;
  const ghPat = process.env.GH_PAT;

  const configured = Boolean(
    owner &&
      repo &&
      path &&
      ghPat &&
      adminId &&
      /^[\w.-]+$/.test(owner) &&
      /^[\w.-]+$/.test(repo)
  );
  return { configured, owner, repo, branch, path, adminId, ghPat };
}

export class GithubConflictError extends Error {
  status = 409;
}

export class GithubApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export class GithubNotConfiguredError extends Error {
  status = 503;
}

export interface RemoteContent {
  data: ContentFile;
  sha: string;
  encoding: string;
  updatedAt: string;
  commitSha?: string;
  commitMessage?: string;
}

interface GithubRawFile {
  content?: string;
  encoding?: string;
  sha?: string;
  name?: string;
  path?: string;
}

async function githubFetch(url: string, init?: RequestInit): Promise<Response> {
  const cfg = getGithubConfig();
  if (!cfg.ghPat) {
    throw new GithubNotConfiguredError("GitHub token (GH_PAT) belum dikonfigurasi.");
  }
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${cfg.ghPat}`,
      "User-Agent": "cv-for-kreatif",
      ...(init?.headers ?? {}),
    },
  });
}

function parseRawFile(body: unknown, path: string): GithubRawFile {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new GithubApiError(
      `Respon GitHub tidak dikenali untuk ${path}.`,
      502
    );
  }
  return body as GithubRawFile;
}

export async function fetchRemoteContent(
  cfg: GithubConfig = getGithubConfig()
): Promise<{ remote: RemoteContent | null; cfg: GithubConfig }> {
  if (!cfg.configured) {
    throw new GithubNotConfiguredError("Integrasi GitHub belum dikonfigurasi.");
  }
  const ref = encodeURIComponent(cfg.branch ?? "main");
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}?ref=${ref}`;

  const res = await githubFetch(url);
  if (res.status === 404) {
    return { remote: null, cfg };
  }
  if (!res.ok) {
    throw new GithubApiError(
      `Gagal membaca konten dari GitHub (HTTP ${res.status}).`,
      res.status
    );
  }
  const raw = parseRawFile(await res.json(), cfg.path ?? "data/cv.json");
  const content = raw.content ?? "";
  if (!raw.sha) {
    throw new GithubApiError("File konten tanpa versi (SHA) di GitHub.", 502);
  }
  let updatedAt = "";
  try {
    const headersRes = await fetch(
      `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/commits?path=${cfg.path}&sha=${ref}&per_page=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          Authorization: `Bearer ${cfg.ghPat}`,
          "User-Agent": "cv-for-kreatif",
        },
      }
    );
    if (headersRes.ok) {
      const commits = (await headersRes.json()) as {
        sha?: string;
        commit?: { message?: string; author?: { date?: string } };
      }[];
      const latest = commits[0];
      if (latest) {
        updatedAt = latest.commit?.author?.date ?? "";
      }
    }
  } catch {
  }

  let data: ContentFile;
  try {
    const decoded = Buffer.from(content, "base64").toString("utf8");
    const parsed: unknown = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("JSON tidak berupa objek");
    }
    data = parsed as ContentFile;
  } catch {
    throw new GithubApiError(
      `File ${cfg.path} di GitHub bukan JSON CV yang valid.`,
      502
    );
  }

  return {
    cfg,
    remote: {
      data,
      sha: raw.sha,
      encoding: raw.encoding ?? "base64",
      updatedAt,
    },
  };
}

export interface WriteResult {
  sha: string;
  commitSha: string;
  commitMessage: string;
  htmlUrl?: string;
}

export async function writeRemoteContent(opts: {
  content: ContentFile;
  baseSha: string | null;
  message: string;
}): Promise<WriteResult> {
  const cfg = getGithubConfig();
  if (!cfg.configured) {
    throw new GithubNotConfiguredError("Integrasi GitHub belum dikonfigurasi.");
  }
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`;

  const body: Record<string, unknown> = {
    message: opts.message,
    branch: cfg.branch,
    content: Buffer.from(JSON.stringify(opts.content, null, 2), "utf8").toString(
      "base64"
    ),
  };
  if (opts.baseSha) {
    body.sha = opts.baseSha;
  }

  const res = await githubFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    throw new GithubConflictError(
      "Konten di GitHub sudah berubah sejak dibuka."
    );
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new GithubApiError(
      `Gagal menulis konten ke GitHub (HTTP ${res.status})${detail ? `: ${detail.slice(0, 300)}` : ""}.`,
      res.status
    );
  }

  const updated = (await res.json()) as {
    content?: { sha?: string };
    commit?: { sha?: string; message?: string; html_url?: string };
  };
  const sha = updated.content?.sha;
  if (!sha) {
    throw new GithubApiError("GitHub tidak mengembalikan SHA terbaru.", 502);
  }
  return {
    sha,
    commitSha: updated.commit?.sha ?? sha,
    commitMessage: opts.message,
    htmlUrl: updated.commit?.html_url,
  };
}

export const PUBLISH_COMMIT_PREFIX = "cv-kreatif: publish content";

export function publishCommitMessage(): string {
  return `${PUBLISH_COMMIT_PREFIX} — ${new Date().toISOString()}`;
}