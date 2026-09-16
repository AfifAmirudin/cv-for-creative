import { requireAdmin } from "@/lib/guard";
import { getDeploymentStatus } from "@/lib/vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function GET(request: Request) {
  const authResult = await requireAdmin();
  if (!authResult.ok) return json({ ok: false, error: authResult.error.message }, authResult.error.status);

  const url = new URL(request.url);
  const sha = url.searchParams.get("sha");
  if (!sha || !/^[0-9a-f]{40}$/i.test(sha)) {
    return json({ ok: false, error: "Parameter SHA tidak valid." }, 400);
  }

  const status = await getDeploymentStatus(sha);
  return json({ ok: true, deployment: status });
}