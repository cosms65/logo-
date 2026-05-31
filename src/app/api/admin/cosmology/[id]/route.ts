import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1).optional(), summary: z.unknown().optional(), bannerImageId: z.string().nullable().optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = parsed.data.title ? await createUniqueSlug(parsed.data.title, (candidate) => prisma.cosmology.findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })) : undefined;
  const cosmology = await prisma.cosmology.update({ where: { id }, data: { ...parsed.data, slug, renderedText: parsed.data.summary === undefined ? undefined : asPlainText(parsed.data.summary) } });
  return NextResponse.json(cosmology);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.$transaction([
    prisma.relationship.deleteMany({ where: { OR: [{ sourceType: "COSMOLOGY", sourceId: id }, { targetType: "COSMOLOGY", targetId: id }] } }),
    prisma.cosmology.delete({ where: { id } })
  ]);
  return NextResponse.json({ ok: true });
}
