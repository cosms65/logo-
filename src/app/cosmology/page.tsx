import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CosmologyPage() {
  const entries = await prisma.cosmology.findMany({ orderBy: { title: "asc" }, take: 100 });
  return <main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-4xl font-black text-white">Cosmology</h1><p className="mt-3 text-starlight/70">Cosmology entries are framework records only. Add your own manually authored content from the admin dashboard.</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{entries.length ? entries.map((entry) => <Card key={entry.id}><Link className="text-xl font-bold text-white hover:text-plasma" href={`/cosmology/${entry.slug}`}>{entry.title}</Link><p className="mt-2 text-sm text-starlight/60">{entry.renderedText}</p></Card>) : <Card>No cosmology entries created yet.</Card>}</div></main>;
}
