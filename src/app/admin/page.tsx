import { redirect } from "next/navigation";
import { QuickCreate } from "@/components/admin/quick-create";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EDITOR") redirect("/login");
  const [articles, characters, factions, chapters, users] = await Promise.all([
    prisma.article.count(), prisma.character.count(), prisma.faction.count(), prisma.chapter.count(), prisma.user.count()
  ]);
  const stats = [["Articles", articles], ["Characters", characters], ["Factions", factions], ["Chapters", chapters], ["Users", users]];
  return <main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-4xl font-black text-white">Admin Dashboard</h1><p className="mt-3 text-starlight/70">Create content, upload media, manage users, publish chapters, and organize the wiki without editing code.</p><section className="mt-8 grid gap-4 md:grid-cols-5">{stats.map(([label, value]) => <Card key={label as string}><p className="text-sm text-starlight/60">{label as string}</p><p className="mt-2 text-3xl font-black text-white">{value as number}</p></Card>)}</section><section className="mt-8 grid gap-6 lg:grid-cols-[1fr_.8fr]"><QuickCreate /><Card><h2 className="text-xl font-bold text-white">Production editor roadmap</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-starlight/70"><li>Connect a rich text editor such as TipTap or Lexical to the JSON content fields.</li><li>Expose detailed CRUD screens for each entity type and custom field definitions.</li><li>Add invite-only admin onboarding and audit logs before public launch.</li><li>Move large-scale search to PostgreSQL full-text indexes or a dedicated search service.</li></ul></Card></section></main>;
}
