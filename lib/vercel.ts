import "server-only";

export interface DeploymentStatus {
  configured: boolean;
  sha: string;
  state: "READY" | "ERROR" | "CANCELED" | "BUILDING" | "QUEUED" | "PENDING" | null;
  url?: string;
  createdAt?: string;
  readyAt?: string;
  inspectedAt: string;
}

interface VercelDeployment {
  uid?: string;
  state?: string;
  url?: string;
  createdAt?: number;
  ready?: number;
  meta?: {
    githubCommitSha?: string;
    githubCommitRef?: string;
  };
}

export function isDeploymentVerificationConfigured(): boolean {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID);
}

export async function getDeploymentStatus(
  commitSha: string
): Promise<DeploymentStatus> {
  const inspectedAt = new Date().toISOString();
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return {
      configured: false,
      sha: commitSha,
      state: null,
      inspectedAt,
    };
  }

  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(
      projectId
    )}&limit=30`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        configured: true,
        sha: commitSha,
        state: null,
        inspectedAt,
      };
    }
    const body = (await res.json()) as { deployments?: VercelDeployment[] };
    const match = (body.deployments ?? []).find(
      (d) => d.meta?.githubCommitSha === commitSha
    );
    if (!match) {
      return { configured: true, sha: commitSha, state: null, inspectedAt };
    }
    return {
      configured: true,
      sha: commitSha,
      state: (match.state as DeploymentStatus["state"]) ?? null,
      url: match.url ? `https://${match.url}` : undefined,
      createdAt: match.createdAt ? new Date(match.createdAt).toISOString() : undefined,
      readyAt: match.ready
        ? new Date(match.ready).toISOString()
        : undefined,
      inspectedAt,
    };
  } catch {
    return { configured: true, sha: commitSha, state: null, inspectedAt };
  }
}