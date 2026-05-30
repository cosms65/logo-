import Image from "next/image";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const events = await prisma.timelineEvent.findMany({ include: { bannerImage: true }, orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }], take: 200 });
  return <main className="mx-auto max-w-5xl px-4 py-10"><h1 className="text-4xl font-black text-white">Timeline</h1><p className="mt-3 text-starlight/70">Historical events, eras, wars, discoveries, and other dated entries display in chronological format after you create them.</p><div className="mt-10 border-l border-plasma/40 pl-4 sm:pl-6">{events.length ? events.map((event) => <Card key={event.id} id={event.slug} className="mb-6 overflow-hidden p-0">{event.bannerImage ? <Image src={event.bannerImage.secureUrl} alt={event.bannerImage.altText ?? event.title} width={event.bannerImage.width ?? 1200} height={event.bannerImage.height ?? 500} className="h-40 w-full object-cover sm:h-56" /> : null}<div className="p-5 sm:p-6"><p className="text-sm text-plasma">{event.era ?? "Era not set"}</p><h2 className="text-2xl font-bold text-white">{event.title}</h2><p className="mt-3 whitespace-pre-wrap text-starlight/70">{event.renderedText}</p></div></Card>) : <Card>No timeline events created yet.</Card>}</div></main>;
}
