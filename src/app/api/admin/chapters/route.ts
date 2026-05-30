import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1), number: z.number().int().positive(), content: z.unknown().optional(), volumeId: z.string().optional(), status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"), scheduledFor: z.string().datetime().optional() });

export async function GET() {
  return NextResponse.json(await prisma.chapter.findMany({ orderBy: [{ volume: { position: "asc" } }, { number: "asc" }], include: { volume: true }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const chapter = await prisma.chapter.create({ data: { ...parsed.data, slug: makeSlug(`${parsed.data.number}-${parsed.data.title}`), renderedText: asPlainText(parsed.data.content), authorId: guard.session.user.id, publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined, scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined } });
  return NextResponse.json(chapter, { status: 201 });
}
