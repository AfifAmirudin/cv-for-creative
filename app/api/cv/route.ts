import {
  GithubApiError,
  GithubConflictError,
  GithubNotConfiguredError,
  fetchRemoteContent,
  getGithubConfig,
  publishCommitMessage,
  writeRemoteContent,
} from "@/lib/github";
import { defaultContent, parseContentFile } from "@/lib/cv";
import { GuardError, isAllowedOrigin, requireAdmin } from "@/lib/guard";
import { getDeploymentStatus } from "@/lib/vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function mapGithubError(error: unknown) {
  if (error instanceof GuardError) return json({ ok: false, error: error.message }, error.status);
  if (error instanceof GithubNotConfiguredError)
    return json({ ok: false, error: error.message }, error.status);
  if (error instanceof GithubConflictError)
    return json({ ok: false, conflict: true, error: error.message }, error.status);
  if (error instanceof GithubApiError)
    return json({ ok: false, error: error.message }, error.status);
  const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
  return json({ ok: false, error: message }, 502);
}

export async function GET() {
  const authResult = await requireAdmin();
  if (!authResult.ok) return json({ ok: false, error: authResult.error.message }, authResult.error.status);

  const cfg = getGithubConfig();
  if (!cfg.configured) {
    return json(
      { ok: false, error: "Integrasi GitHub belum dikonfigurasi di server." },
      503
    );
  }

  try {
    const { remote } = await fetchRemoteContent(cfg);
    if (!remote) {
      return json({
        ok: true,
        content: defaultContent,
        sha: null,
        source: "bundle",
        warning:
          "File konten belum ada di GitHub. Konten bawaan dimuat; Simpan & Publikasikan akan membuat file tersebut.",
      });
    }
    return json({
      ok: true,
      content: remote.data,
      sha: remote.sha,
      source: "github",
      updatedAt: remote.updatedAt,
    });
  } catch (error) {
    return mapGithubError(error);
  }
}

export async function PUT(request: Request) {
  const authResult = await requireAdmin();
  if (!authResult.ok) return json({ ok: false, error: authResult.error.message }, authResult.error.status);

  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return json({ ok: false, error: "Asal permintaan tidak diizinkan." }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Payload tidak valid." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "Payload tidak valid." }, 400);
  }
  const record = body as Record<string, unknown>;
  if (typeof record.content !== "object" || record.content === null) {
    return json({ ok: false, error: "Konten tidak lengkap." }, 400);
  }
  const sha = typeof record.sha === "string" && record.sha.length > 0 ? record.sha : null;

  const parsed = parseContentFile(record.content);
  if (!parsed.ok || !parsed.data) {
    return json({ ok: false, error: parsed.error ?? "Konten tidak valid." }, 400);
  }

  const cfg = getGithubConfig();
  if (!cfg.configured) {
    return json(
      { ok: false, error: "Integrasi GitHub belum dikonfigurasi di server." },
      503
    );
  }

  let remoteSha: string | null;
  let remoteData = defaultContent;
  try {
    const { remote } = await fetchRemoteContent(cfg);
    remoteSha = remote?.sha ?? null;
    if (remote) remoteData = remote.data;
  } catch (error) {
    return mapGithubError(error);
  }

  if (remoteSha !== sha) {
    return json(
      {
        ok: false,
        conflict: true,
        error:
          "Konten di GitHub sudah diubah perangkat lain sejak dibuka. Muat versi terbaru untuk melanjutkan.",
        latest: { content: remoteData, sha: remoteSha },
      },
      409
    );
  }

  try {
    const written = await writeRemoteContent({
      content: parsed.data,
      baseSha: sha,
      message: publishCommitMessage(),
    });

    let deployment = null;
    try {
      deployment = await getDeploymentStatus(written.commitSha);
    } catch {
      deployment = null;
    }

    return json({
      ok: true,
      sha: written.sha,
      commitSha: written.commitSha,
      commitMessage: written.commitMessage,
      htmlUrl: written.htmlUrl,
      deployment,
    });
  } catch (error) {
    return mapGithubError(error);
  }
}