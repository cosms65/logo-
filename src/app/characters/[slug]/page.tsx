import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const character = await prisma.character.findUnique({ where: { slug }, include: { customFields: { include: { definition: true } } } });
  if (!character) notFound();
  return <main className="mx-auto max-w-5xl px-4 py-10"><Card><p className="text-sm uppercase tracking-[0.24em] text-plasma">Character</p><h1 className="mt-2 text-4xl font-black text-white">{character.name}</h1><p className="mt-4 text-starlight/70">{character.renderedText || "Biography has not been authored yet."}</p><dl className="mt-8 grid gap-3 md:grid-cols-2">{character.customFields.map((field) => <div key={field.id} className="rounded-xl bg-white/5 p-3"><dt className="text-sm text-starlight/60">{field.definition.label}</dt><dd className="text-white">{JSON.stringify(field.value)}</dd></div>)}</dl></Card></main>;
}
