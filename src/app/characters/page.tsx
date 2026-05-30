import Link from "next/link";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({ orderBy: { name: "asc" }, take: 100 });
  return <main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-4xl font-black text-white">Character Database</h1><p className="mt-3 text-starlight/70">Profiles, images, biographies, relationships, statuses, and unlimited custom attributes are managed in admin.</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{characters.length ? characters.map((character) => <Card key={character.id}><Link className="text-xl font-bold text-white hover:text-plasma" href={`/characters/${character.slug}`}>{character.name}</Link><p className="mt-2 text-sm text-starlight/60">{character.status ?? "Status not set"}</p></Card>) : <Card>No characters created yet.</Card>}</div></main>;
}
