import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "cv.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return Response.json(JSON.parse(raw));
  } catch {
    return Response.json(null);
  }
}

export async function PUT(request: Request) {
  try {
    const body: unknown = await request.json();
    if (
      !isRecord(body) ||
      !isRecord(body.id) ||
      !isRecord(body.en) ||
      !isRecord(body.theme)
    ) {
      return Response.json(
        { ok: false, error: "Payload tidak lengkap." },
        { status: 400 }
      );
    }
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(body, null, 2), "utf8");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}