import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1), description: z.unknown().optional(), bannerId: z.string().optional(), logoId: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.faction.findMany({ orderBy: { name: "asc" }, include: { customFields: { include: { definition: true } } }, take: 100 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const faction = await prisma.faction.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.name), renderedText: asPlainText(parsed.data.description) } });
  return NextResponse.json(faction, { status: 201 });
}
