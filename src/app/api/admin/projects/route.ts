import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import { getProjectsFile, updateProjectsFile } from "@/lib/github";
import type { Project } from "@/app/api/projects/route";

async function requireAuth() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session.isLoggedIn ? session : null;
}

/** GET /api/admin/projects — returns ALL projects (active + inactive) */
export async function GET() {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await getProjectsFile();
    const data = JSON.parse(content) as { projects: Project[] };
    return NextResponse.json(data.projects);
  } catch (err) {
    console.error("[GET /api/admin/projects]", err);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

/** POST /api/admin/projects — replace the full projects array */
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let projects: Project[];
  try {
    const body = await request.json();
    projects = body.projects;

    if (!Array.isArray(projects)) {
      return NextResponse.json(
        { error: "Invalid payload: projects must be an array" },
        { status: 400 }
      );
    }

    // Enforce: at most 2 active projects
    const activeCount = projects.filter((p) => p.active).length;
    if (activeCount > 2) {
      return NextResponse.json(
        { error: "Only 2 projects can be active at a time" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const { sha } = await getProjectsFile();
    const newContent = JSON.stringify({ projects }, null, 2);
    await updateProjectsFile(newContent, sha);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/projects]", err);
    return NextResponse.json(
      { error: "Failed to save projects" },
      { status: 500 }
    );
  }
}
