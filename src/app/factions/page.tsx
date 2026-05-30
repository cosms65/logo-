import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FactionsPage() {
  const factions = await prisma.faction.findMany({ orderBy: { name: "asc" }, take: 100 });
  return <main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-4xl font-black text-white">Faction Database</h1><p className="mt-3 text-starlight/70">Faction banners, logos, leaders, members, relationships, and custom fields are powered by the database.</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{factions.length ? factions.map((faction) => <Card key={faction.id}><Link className="text-xl font-bold text-white hover:text-plasma" href={`/factions/${faction.slug}`}>{faction.name}</Link></Card>) : <Card>No factions created yet.</Card>}</div></main>;
}
