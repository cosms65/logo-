import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CosmologyEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await prisma.cosmology.findUnique({ where: { slug }, include: { bannerImage: true, customFields: { include: { definition: true } } } });
  if (!entry) notFound();
  return <main className="mx-auto max-w-5xl px-4 py-10"><Card className="overflow-hidden p-0">{entry.bannerImage ? <Image src={entry.bannerImage.secureUrl} alt={entry.bannerImage.altText ?? entry.title} width={entry.bannerImage.width ?? 1400} height={entry.bannerImage.height ?? 600} className="h-56 w-full object-cover md:h-80" /> : null}<div className="p-6 md:p-8"><p className="text-sm uppercase tracking-[0.24em] text-plasma">Cosmology</p><h1 className="mt-2 text-4xl font-black text-white">{entry.title}</h1><p className="mt-4 text-starlight/70">{entry.renderedText || "Summary has not been authored yet."}</p></div></Card></main>;
}
