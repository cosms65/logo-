import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1).optional(), excerpt: z.string().optional(), content: z.unknown().optional(), bannerImageId: z.string().nullable().optional(), categoryId: z.string().nullable().optional(), status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(), scheduledFor: z.string().datetime().nullable().optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = parsed.data.title ? await createUniqueSlug(parsed.data.title, (candidate) => prisma.article.findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })) : undefined;
  const article = await prisma.article.update({ where: { id }, data: { ...parsed.data, slug, renderedText: parsed.data.content === undefined ? undefined : asPlainText(parsed.data.content), publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined, scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : parsed.data.scheduledFor === null ? null : undefined } });
  return NextResponse.json(article);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.$transaction([
    prisma.relationship.deleteMany({ where: { OR: [{ sourceType: "ARTICLE", sourceId: id }, { targetType: "ARTICLE", targetId: id }] } }),
    prisma.article.delete({ where: { id } })
  ]);
  return NextResponse.json({ ok: true });
}
