import Link from "next/link";
import { WikiSidebar } from "@/components/layout/wiki-sidebar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WikiPage() {
  const articles = await prisma.article.findMany({ where: { status: "PUBLISHED" }, include: { category: true, tags: true }, orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <WikiSidebar />
      <section>
        <h1 className="text-4xl font-black text-white">Wiki Encyclopedia</h1>
        <p className="mt-3 text-starlight/70">Create categories and publish articles through the admin dashboard. This page renders only your authored content.</p>
        <div className="mt-8 grid gap-4">
          {articles.length ? articles.map((article) => <Card key={article.id}><Link href={`/wiki/${article.slug}`} className="text-2xl font-bold text-white hover:text-plasma">{article.title}</Link><p className="mt-2 text-sm text-starlight/60">{article.category?.name ?? "Uncategorized"}</p><p className="mt-3 text-starlight/70">{article.excerpt}</p></Card>) : <Card>No published articles yet.</Card>}
        </div>
      </section>
    </main>
  );
}
