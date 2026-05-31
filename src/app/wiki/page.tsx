import Image from "next/image";
import Link from "next/link";
import { WikiSidebar } from "@/components/layout/wiki-sidebar";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function WikiPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const categorySlug = params?.category;
  const category = categorySlug ? await prisma.category.findUnique({ where: { slug: categorySlug }, include: { children: true } }) : null;
  const categoryIds = category ? [category.id, ...category.children.map((child) => child.id)] : undefined;
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", ...(categoryIds ? { categoryId: { in: categoryIds } } : {}) },
    include: { bannerImage: true, category: true, tags: true },
    orderBy: { updatedAt: "desc" },
    take: 50
  });
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <WikiSidebar />
      <section>
        <h1 className="text-4xl font-black text-white">{category ? category.name : "Wiki Encyclopedia"}</h1>
        <p className="mt-3 text-starlight/70">Open any article card to view its full content and banner image.</p>
        <div className="mt-8 grid gap-4">
          {articles.length ? articles.map((article) => (
            <Card key={article.id} className="overflow-hidden p-0">
              <Link href={`/wiki/${article.slug}`} className="grid gap-0 md:grid-cols-[220px_1fr]">
                {article.bannerImage ? <Image src={article.bannerImage.secureUrl} alt={article.bannerImage.altText ?? article.title} width={360} height={220} className="h-44 w-full object-cover md:h-full" /> : <div className="h-44 bg-gradient-to-br from-eclipse/40 to-plasma/10 md:h-full" />}
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-white hover:text-plasma">{article.title}</h2>
                  <p className="mt-2 text-sm text-starlight/60">{article.category?.name ?? "Uncategorized"}</p>
                  <p className="mt-3 line-clamp-3 text-starlight/70">{article.excerpt || article.renderedText || "Open this article to read the full content."}</p>
                </div>
              </Link>
            </Card>
          )) : <Card>No published articles yet.</Card>}
        </div>
      </section>
    </main>
  );
}
