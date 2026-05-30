import Image from "next/image";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await prisma.character.findUnique({ where: { slug }, include: { bannerImage: true, portraitImage: true, customFields: { include: { definition: true } } } });
  if (!character) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Card className="overflow-hidden p-0">
        {character.bannerImage ? <Image src={character.bannerImage.secureUrl} alt={character.bannerImage.altText ?? character.name} width={character.bannerImage.width ?? 1400} height={character.bannerImage.height ?? 600} className="h-48 w-full object-cover sm:h-64 lg:h-80" /> : <div className="h-48 bg-gradient-to-br from-eclipse/40 to-plasma/10 sm:h-64 lg:h-80" />}
        <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr] md:p-8">
          <div>{character.portraitImage ? <Image src={character.portraitImage.secureUrl} alt={character.portraitImage.altText ?? character.name} width={character.portraitImage.width ?? 500} height={character.portraitImage.height ?? 700} className="mx-auto aspect-[3/4] w-full max-w-[260px] rounded-2xl object-cover shadow-glow md:mx-0" /> : <div className="mx-auto aspect-[3/4] w-full max-w-[260px] rounded-2xl border border-white/10 bg-white/5 md:mx-0" />}</div>
          <section>
            <p className="text-sm uppercase tracking-[0.24em] text-plasma">Character</p>
            <h1 className="mt-2 text-4xl font-black text-white">{character.name}</h1>
            <p className="mt-2 text-sm text-starlight/60">{character.status ?? "Status not set"}</p>
            <p className="mt-6 whitespace-pre-wrap text-starlight/75">{character.renderedText || "Biography has not been authored yet."}</p>
          </section>
        </div>
      </Card>
    </main>
  );
}
