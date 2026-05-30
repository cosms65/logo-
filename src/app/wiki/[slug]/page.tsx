import { notFound } from "next/navigation";
import { WikiSidebar } from "@/components/layout/wiki-sidebar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug }, include: { category: true, tags: true } });
  if (!article || article.status !== "PUBLISHED") notFound();
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <WikiSidebar />
      <article className="prose-cosmic max-w-none rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-plasma">{article.category?.name ?? "Article"}</p>
        <h1>{article.title}</h1>
        <p>{article.renderedText || "This article has no rendered text yet."}</p>
        <Card className="mt-8"><h2 className="mt-0">Related pages</h2><p>Relationship references appear here as entries are linked in the admin panel.</p></Card>
      </article>
    </main>
  );
}
