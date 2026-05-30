import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1), description: z.unknown().optional(), era: z.string().optional(), startsAt: z.string().datetime().optional(), endsAt: z.string().datetime().optional(), sortOrder: z.number().int().default(0) });

export async function GET() {
  return NextResponse.json(await prisma.timelineEvent.findMany({ orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }], take: 200 }));
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const event = await prisma.timelineEvent.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.title), renderedText: asPlainText(parsed.data.description), startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined, endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined } });
  return NextResponse.json(event, { status: 201 });
}
