import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1).optional(), biography: z.unknown().optional(), status: z.string().nullable().optional(), bannerImageId: z.string().nullable().optional(), portraitImageId: z.string().nullable().optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = parsed.data.name ? await createUniqueSlug(parsed.data.name, (candidate) => prisma.character.findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })) : undefined;
  const character = await prisma.character.update({ where: { id }, data: { ...parsed.data, slug, renderedText: parsed.data.biography === undefined ? undefined : asPlainText(parsed.data.biography) } });
  return NextResponse.json(character);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.$transaction([
    prisma.relationship.deleteMany({ where: { OR: [{ sourceType: "CHARACTER", sourceId: id }, { targetType: "CHARACTER", targetId: id }] } }),
    prisma.character.delete({ where: { id } })
  ]);
  return NextResponse.json({ ok: true });
}
