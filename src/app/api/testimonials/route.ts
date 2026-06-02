import { NextResponse } from "next/server";
import { getTestimonialsFile, type Testimonial } from "@/lib/github";

export const dynamic = "force-dynamic";

export type { Testimonial };

export async function GET() {
  try {
    const { content } = await getTestimonialsFile();
    const data = JSON.parse(content) as { testimonials: Testimonial[] };
    const sorted = [...data.testimonials].sort((a, b) => a.order - b.order);
    return NextResponse.json(sorted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[GET /api/testimonials]", err);
    return NextResponse.json({ error: "Failed to load testimonials" }, { status: 500 });
  }
}
