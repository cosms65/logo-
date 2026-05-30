import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = await prisma.chapter.findUnique({ where: { slug }, include: { volume: true } });
  if (!chapter || chapter.status !== "PUBLISHED") notFound();
  const siblings = await prisma.chapter.findMany({ where: { volumeId: chapter.volumeId, status: "PUBLISHED" }, orderBy: { number: "asc" } });
  const index = siblings.findIndex((item) => item.id === chapter.id);
  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  return <main className="mx-auto max-w-3xl px-4 py-10"><article className="prose-cosmic max-w-none"><p className="text-sm uppercase tracking-[0.24em] text-plasma">{chapter.volume?.title ?? "Chapter"} · {chapter.number}</p><h1>{chapter.title}</h1><p>{chapter.renderedText || "Chapter text has not been rendered yet."}</p></article><nav className="mt-10 flex justify-between border-t border-white/10 pt-6">{previous ? <Button href={`/read/${previous.slug}`} variant="ghost">Previous</Button> : <span />}<Link href="/read" className="text-starlight/70 hover:text-white">All chapters</Link>{next ? <Button href={`/read/${next.slug}`}>Next</Button> : <span />}</nav></main>;
}
