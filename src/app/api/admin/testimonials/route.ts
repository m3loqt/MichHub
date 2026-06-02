import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { getTestimonialsFile, updateTestimonialsFile, type Testimonial } from "@/lib/github";

async function requireAuth() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.isLoggedIn ? session : null;
}

export async function GET() {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content } = await getTestimonialsFile();
    const data = JSON.parse(content) as { testimonials: Testimonial[] };
    return NextResponse.json(data.testimonials);
  } catch (err) {
    console.error("[GET /api/admin/testimonials]", err);
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let testimonials: Testimonial[];
  try {
    const body = await request.json();
    testimonials = body.testimonials;
    if (!Array.isArray(testimonials)) {
      return NextResponse.json({ error: "Invalid payload: testimonials must be an array" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const { sha } = await getTestimonialsFile();
    const newContent = JSON.stringify({ testimonials }, null, 2);
    await updateTestimonialsFile(newContent, sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/testimonials]", err);
    return NextResponse.json({ error: "Failed to save testimonials" }, { status: 500 });
  }
}
