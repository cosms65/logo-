import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function WikiSidebar() {
  const categories = await prisma.category.findMany({ where: { parentId: null }, include: { children: true }, orderBy: { name: "asc" }, take: 50 });
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-plasma">Wiki Explorer</h2>
      <nav className="space-y-3 text-sm">
        <Link href="/wiki" className="block text-white hover:text-plasma">All Articles</Link>
        {categories.map((category) => (
          <div key={category.id}>
            <Link href={`/wiki?category=${category.slug}`} className="font-semibold text-starlight hover:text-white">{category.name}</Link>
            <div className="mt-2 space-y-1 border-l border-white/10 pl-3">
              {category.children.map((child) => <Link key={child.id} href={`/wiki?category=${child.slug}`} className="block text-starlight/70 hover:text-white">{child.name}</Link>)}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
