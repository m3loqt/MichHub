import { NextResponse } from "next/server";
import { getProjectsFile } from "@/lib/github";

export const dynamic = "force-dynamic";

export interface Project {
  id: string;
  clientLabel: string;
  title: string;
  description: string;
  imageSrc: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  active: boolean;
  order: number;
}

export async function GET() {
  try {
    const { content } = await getProjectsFile();
    const data = JSON.parse(content) as { projects: Project[] };

    const active = data.projects
      .filter((p) => p.active)
      .sort((a, b) => a.order - b.order)
      .slice(0, 2);

    return NextResponse.json(active, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[GET /api/projects]", err);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}
