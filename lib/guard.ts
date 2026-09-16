import "server-only";
import type { Session } from "next-auth";
import { auth, isAuthorizedAdmin } from "./auth";

export class GuardError extends Error {
  status: number;
  code: string;
  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export interface AdminContext {
  session: Session;
  admin: true;
  userId: string;
}

function allowedOrigins(): string[] {
  const origins = new Set<string>();

  const pushEntry = (raw: string | undefined) => {
    if (!raw) return;
    for (const entry of raw.split(",")) {
      const trimmed = entry.trim();
      if (!trimmed) continue;
      try {
        const u = new URL(trimmed);
        if (u.protocol === "http:" || u.protocol === "https:") {
          origins.add(u.origin);
        }
      } catch {
      }
    }
  };

  pushEntry(process.env.AUTH_URL);
  pushEntry(process.env.ALLOWED_ORIGINS);
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://localhost:3001");
  }
  return [...origins];
}

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
      return process.env.NODE_ENV !== "production";
    }
  } catch {
    return false;
  }
  return allowedOrigins().includes(origin.replace(/\/+$/, ""));
}

export async function requireAdmin(): Promise<
  { ok: true; ctx: AdminContext } | { ok: false; error: GuardError }
> {
  if (!process.env.CV_ADMIN_ID) {
    return {
      ok: false,
      error: new GuardError(
        "CV_ADMIN_ID belum dikonfigurasi di server.",
        500,
        "admin_not_configured"
      ),
    };
  }
  const session: Session | null = await auth();
  if (!session?.user) {
    return {
      ok: false,
      error: new GuardError("Tidak terautentikasi.", 401, "unauthorized"),
    };
  }
  if (!isAuthorizedAdmin(session)) {
    return {
      ok: false,
      error: new GuardError(
        "Akun GitHub ini tidak memiliki akses administrasi.",
        403,
        "forbidden"
      ),
    };
  }
  return {
    ok: true,
    ctx: { session, admin: true, userId: String(session.user.id) },
  };
}