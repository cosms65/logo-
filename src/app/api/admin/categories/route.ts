import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { createUniqueSlug } from "@/lib/server-utils";

const schema = z.object({ name: z.string().min(1), description: z.string().optional(), parentId: z.string().optional() });

export async function GET() {
  return NextResponse.json(await prisma.category.findMany({ include: { children: true }, orderBy: { name: "asc" } }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const slug = await createUniqueSlug(parsed.data.name, (candidate) => prisma.category.findUnique({ where: { slug: candidate }, select: { id: true } }));
  const category = await prisma.category.create({ data: { ...parsed.data, slug } });
  return NextResponse.json(category, { status: 201 });
}
