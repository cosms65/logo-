import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1), number: z.number().int().positive().optional(), content: z.unknown().optional(), volumeId: z.string().optional(), status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"), scheduledFor: z.string().datetime().optional() });

export async function GET() {
  return NextResponse.json(await prisma.chapter.findMany({ orderBy: [{ volume: { position: "asc" } }, { number: "asc" }], include: { volume: true }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const nextNumber = parsed.data.number ?? ((await prisma.chapter.aggregate({ where: { volumeId: parsed.data.volumeId }, _max: { number: true } }))._max.number ?? 0) + 1;
  const slug = await createUniqueSlug(`${nextNumber}-${parsed.data.title}`, (candidate) => prisma.chapter.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const chapter = await prisma.chapter.create({ data: { ...parsed.data, number: nextNumber, slug, renderedText: asPlainText(parsed.data.content), authorId: guard.session.user.id, publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined, scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined } });
  return NextResponse.json(chapter, { status: 201 });
}
