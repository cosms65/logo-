import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1), description: z.unknown().optional(), bannerImageId: z.string().optional(), era: z.string().optional(), startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional(), sortOrder: z.number().int().default(0) });

export async function GET() {
  return NextResponse.json(await prisma.timelineEvent.findMany({ orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }], take: 200 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = await createUniqueSlug(parsed.data.title, (candidate) => prisma.timelineEvent.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const event = await prisma.timelineEvent.create({ data: { ...parsed.data, slug, renderedText: asPlainText(parsed.data.description), startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined, endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined } });
  return NextResponse.json(event, { status: 201 });
}
