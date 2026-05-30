import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

const schema = z.object({ sourceType: z.enum(["ARTICLE", "CHARACTER", "FACTION", "CHAPTER", "TIMELINE_EVENT", "CATEGORY", "MEDIA_ASSET", "LOCATION", "REALM"]), sourceId: z.string(), targetType: z.enum(["ARTICLE", "CHARACTER", "FACTION", "CHAPTER", "TIMELINE_EVENT", "CATEGORY", "MEDIA_ASSET", "LOCATION", "REALM"]), targetId: z.string(), type: z.enum(["RELATED", "MEMBER_OF", "LEADS", "ALLY", "RIVAL", "APPEARS_IN", "REFERENCES", "PARENT_OF", "CUSTOM"]).default("RELATED"), label: z.string().optional(), metadata: z.unknown().optional() });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceType = searchParams.get("sourceType");
  const sourceId = searchParams.get("sourceId");
  if (!sourceType || !sourceId) return NextResponse.json({ relationships: [] });
  return NextResponse.json({ relationships: await prisma.relationship.findMany({ where: { sourceType: sourceType as never, sourceId } }) });
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const relationship = await prisma.relationship.create({ data: { ...parsed.data, metadata: parsed.data.metadata ?? {} } });
  return NextResponse.json(relationship, { status: 201 });
}
