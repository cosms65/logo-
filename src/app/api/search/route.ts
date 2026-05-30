import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const [articles, chapters, characters, factions, timeline, cosmology] = await Promise.all([
    prisma.article.findMany({ where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.chapter.findMany({ where: { status: "PUBLISHED", OR: [{ title: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.character.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.faction.findMany({ where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.timelineEvent.findMany({ where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.cosmology.findMany({ where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { renderedText: { contains: q, mode: "insensitive" } }] }, take: 10 })
  ]);

  return NextResponse.json({
    results: [
      ...articles.map((item) => ({ type: "Article", title: item.title, href: `/wiki/${item.slug}` })),
      ...chapters.map((item) => ({ type: "Chapter", title: item.title, href: `/read/${item.slug}` })),
      ...characters.map((item) => ({ type: "Character", title: item.name, href: `/characters/${item.slug}` })),
      ...factions.map((item) => ({ type: "Faction", title: item.name, href: `/factions/${item.slug}` })),
      ...timeline.map((item) => ({ type: "Timeline", title: item.title, href: `/timeline#${item.slug}` })),
      ...cosmology.map((item) => ({ type: "Cosmology", title: item.title, href: `/cosmology/${item.slug}` }))
    ]
  });
}
