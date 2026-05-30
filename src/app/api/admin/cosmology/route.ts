import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1),
  summary: z.unknown().optional(),
  bannerImageId: z.string().optional()
});

export async function GET() {
  return NextResponse.json(await prisma.cosmology.findMany({ orderBy: { title: "asc" }, include: { bannerImage: true, customFields: { include: { definition: true } } }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const cosmology = await prisma.cosmology.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.title), renderedText: asPlainText(parsed.data.summary) } });
  return NextResponse.json(cosmology, { status: 201 });
}
