import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

const GITHUB_API = "https://api.github.com";
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH ?? "main";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/** Get existing file sha (needed to overwrite). Returns null if file doesn't exist. */
async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: ghHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

export async function POST(request: NextRequest) {
  // Auth check
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be under 5 MB" },
      { status: 400 }
    );
  }

  // Sanitize filename — strip unsafe chars, prefix with timestamp
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = `${Date.now()}-${file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()}`;
  const filePath = `public/uploads/${safeName}`;

  // Convert to base64
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Check if file already exists (shouldn't with timestamp prefix, but just in case)
  const existingSha = await getFileSha(filePath);

  // Commit to GitHub
  const body: Record<string, string> = {
    message: `chore: upload project image ${safeName}`,
    content: base64,
    branch,
  };
  if (existingSha) body.sha = existingSha;

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: ghHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[POST /api/admin/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Return the public path the Next.js app can use
  return NextResponse.json({ path: `/uploads/${safeName}` });
}
