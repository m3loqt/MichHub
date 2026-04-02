import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { checkRateLimit, clearRateLimit } from "@/lib/rate-limit";

const INVALID_MSG = "Invalid credentials";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  let username: string;
  let password: string;
  try {
    const body = await request.json();
    username = String(body.username ?? "").trim();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: INVALID_MSG }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
  }

  clearRateLimit(`login:${ip}`);

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.isLoggedIn = true;
  session.username = username;
  await session.save();

  return NextResponse.json({ ok: true });
}
