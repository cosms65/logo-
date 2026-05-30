import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReadPage() {
  const chapters = await prisma.chapter.findMany({ where: { status: "PUBLISHED" }, include: { volume: true }, orderBy: [{ volume: { position: "asc" } }, { number: "asc" }], take: 100 });
  return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-4xl font-black text-white">Novel Reader</h1><p className="mt-3 text-starlight/70">Published chapters appear here with volume ordering, reading progress, bookmarks, and navigation support.</p><div className="mt-8 space-y-4">{chapters.length ? chapters.map((chapter) => <Card key={chapter.id}><p className="text-sm text-plasma">{chapter.volume?.title ?? "Standalone"} · Chapter {chapter.number}</p><Link className="text-2xl font-bold text-white hover:text-plasma" href={`/read/${chapter.slug}`}>{chapter.title}</Link></Card>) : <Card>No published chapters yet.</Card>}</div></main>;
}
