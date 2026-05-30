import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FactionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const faction = await prisma.faction.findUnique({ where: { slug }, include: { customFields: { include: { definition: true } } } });
  if (!faction) notFound();
  return <main className="mx-auto max-w-5xl px-4 py-10"><Card><p className="text-sm uppercase tracking-[0.24em] text-plasma">Faction</p><h1 className="mt-2 text-4xl font-black text-white">{faction.name}</h1><p className="mt-4 text-starlight/70">{faction.renderedText || "Description has not been authored yet."}</p></Card></main>;
}
