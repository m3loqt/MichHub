import { NextResponse } from "next/server";
import { getPortfolioFile, type PortfolioItem } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { content } = await getPortfolioFile();
    const data = JSON.parse(content) as { items: PortfolioItem[] };
    const sorted = [...data.items].sort((a, b) => a.order - b.order);
    return NextResponse.json(sorted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[GET /api/portfolio]", err);
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}
