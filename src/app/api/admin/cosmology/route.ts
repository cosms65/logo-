import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

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
  const slug = await createUniqueSlug(parsed.data.title, (candidate) => prisma.cosmology.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const cosmology = await prisma.cosmology.create({ data: { ...parsed.data, slug, renderedText: asPlainText(parsed.data.summary) } });
  return NextResponse.json(cosmology, { status: 201 });
}
