import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1), biography: z.unknown().optional(), status: z.string().optional(), bannerImageId: z.string().optional(), portraitImageId: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.character.findMany({ orderBy: { name: "asc" }, include: { customFields: { include: { definition: true } } }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const character = await prisma.character.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.name), renderedText: asPlainText(parsed.data.biography) } });
  return NextResponse.json(character, { status: 201 });
}
