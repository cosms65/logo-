import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1), biography: z.unknown().optional(), status: z.string().optional(), bannerImageId: z.string().optional(), portraitImageId: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.character.findMany({ orderBy: { name: "asc" }, include: { customFields: { include: { definition: true } } }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = await createUniqueSlug(parsed.data.name, (candidate) => prisma.character.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const character = await prisma.character.create({ data: { ...parsed.data, slug, renderedText: asPlainText(parsed.data.biography) } });
  return NextResponse.json(character, { status: 201 });
}
