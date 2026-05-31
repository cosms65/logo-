import { redirect } from "next/navigation";
import { ContentStudio } from "@/components/admin/content-studio";
import { EntityManager } from "@/components/admin/entity-manager";
import { QuickCreate } from "@/components/admin/quick-create";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EDITOR") redirect("/login");
  const [articles, characters, factions, chapters, cosmology, users] = await Promise.all([
    prisma.article.count(), prisma.character.count(), prisma.faction.count(), prisma.chapter.count(), prisma.cosmology.count(), prisma.user.count()
  ]);
  const stats = [["Articles", articles], ["Characters", characters], ["Factions", factions], ["Chapters", chapters], ["Cosmology", cosmology], ["Users", users]];
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
      <p className="mt-3 text-starlight/70">Create content, upload character portraits, set landscape banners, manage users, publish chapters, and organize the site without editing code.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map(([label, value]) => <Card key={label as string}><p className="text-sm text-starlight/60">{label as string}</p><p className="mt-2 text-3xl font-black text-white">{value as number}</p></Card>)}
      </section>
      <section className="mt-8 space-y-6">
        <ContentStudio />
        <EntityManager />
        <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <QuickCreate />
          <Card>
            <h2 className="text-xl font-bold text-white">Responsive upload guidance</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-starlight/70">
              <li>Use landscape banners for desktop headers; the UI crops them responsively on mobile.</li>
              <li>Use character portraits for vertical or square artwork.</li>
              <li>Use faction logos as square images, separate from faction landscape banners.</li>
              <li>Keep images compressed before uploading for faster mobile loading.</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}
