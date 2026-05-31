import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";
import { asPlainText } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1), description: z.unknown().optional(), bannerId: z.string().optional(), logoId: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.faction.findMany({ orderBy: { name: "asc" }, include: { customFields: { include: { definition: true } } }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = await createUniqueSlug(parsed.data.name, (candidate) => prisma.faction.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const faction = await prisma.faction.create({ data: { ...parsed.data, slug, renderedText: asPlainText(parsed.data.description) } });
  return NextResponse.json(faction, { status: 201 });
}
