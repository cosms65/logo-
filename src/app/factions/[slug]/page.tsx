import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FactionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const faction = await prisma.faction.findUnique({ where: { slug }, include: { banner: true, logo: true, customFields: { include: { definition: true } } } });
  if (!faction) notFound();
  return <main className="mx-auto max-w-6xl px-4 py-10"><Card className="overflow-hidden p-0">{faction.banner ? <Image src={faction.banner.secureUrl} alt={faction.banner.altText ?? faction.name} width={faction.banner.width ?? 1400} height={faction.banner.height ?? 600} className="h-48 w-full object-cover sm:h-64 lg:h-80" /> : null}<div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start md:p-8">{faction.logo ? <Image src={faction.logo.secureUrl} alt={faction.logo.altText ?? faction.name} width={faction.logo.width ?? 240} height={faction.logo.height ?? 240} className="h-28 w-28 rounded-2xl object-cover" /> : null}<div><p className="text-sm uppercase tracking-[0.24em] text-plasma">Faction</p><h1 className="mt-2 text-4xl font-black text-white">{faction.name}</h1><p className="mt-4 whitespace-pre-wrap text-starlight/70">{faction.renderedText || "Description has not been authored yet."}</p></div></div></Card></main>;
}
