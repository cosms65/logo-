import { NextResponse } from "next/server";
import { z } from "zod";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { asPlainText, makeSlug } from "@/lib/utils";

const schema = z.object({ title: z.string().min(1), excerpt: z.string().optional(), content: z.unknown().optional(), bannerImageId: z.string().optional(), categoryId: z.string().optional(), status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"), scheduledFor: z.string().datetime().optional() });

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true, tags: true }, take: 100 });
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const article = await prisma.article.create({ data: { ...parsed.data, slug: makeSlug(parsed.data.title), renderedText: asPlainText(parsed.data.content), authorId: guard.session.user.id, publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined, scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : undefined } });
  return NextResponse.json(article, { status: 201 });
}
