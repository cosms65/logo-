import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1).optional(), description: z.unknown().optional(), bannerImageId: z.string().nullable().optional(), era: z.string().nullable().optional(), startsAt: z.string().datetime().nullable().optional(), endsAt: z.string().datetime().nullable().optional(), sortOrder: z.number().int().optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = parsed.data.title ? await createUniqueSlug(parsed.data.title, (candidate) => prisma.timelineEvent.findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })) : undefined;
  const event = await prisma.timelineEvent.update({ where: { id }, data: { ...parsed.data, slug, renderedText: parsed.data.description === undefined ? undefined : asPlainText(parsed.data.description), startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : parsed.data.startsAt === null ? null : undefined, endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : parsed.data.endsAt === null ? null : undefined } });
  return NextResponse.json(event);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.$transaction([
    prisma.relationship.deleteMany({ where: { OR: [{ sourceType: "TIMELINE_EVENT", sourceId: id }, { targetType: "TIMELINE_EVENT", targetId: id }] } }),
    prisma.timelineEvent.delete({ where: { id } })
  ]);
  return NextResponse.json({ ok: true });
}
