import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { getPortfolioFile, updatePortfolioFile, type PortfolioItem } from "@/lib/github";

async function requireAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.isLoggedIn ? session : null;
}

/** GET /api/admin/portfolio — returns all portfolio items */
export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content } = await getPortfolioFile();
    const data = JSON.parse(content) as { items: PortfolioItem[] };
    return NextResponse.json(data.items);
  } catch (err) {
    console.error("[GET /api/admin/portfolio]", err);
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}

/** POST /api/admin/portfolio — replace the full items array */
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let items: PortfolioItem[];
  try {
    const body = await request.json();
    items = body.items;
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload: items must be an array" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const { sha } = await getPortfolioFile();
    await updatePortfolioFile(JSON.stringify({ items }, null, 2), sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/portfolio]", err);
    return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 });
  }
}
