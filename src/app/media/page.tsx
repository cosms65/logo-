import Image from "next/image";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return <main className="mx-auto max-w-7xl px-4 py-10"><h1 className="text-4xl font-black text-white">Media Library</h1><p className="mt-3 text-starlight/70">Cloudinary assets for banners, portraits, maps, faction logos, and galleries.</p><div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-4">{assets.length ? assets.map((asset) => <Card key={asset.id} className="p-3"><Image src={asset.secureUrl} alt={asset.altText ?? "Media asset"} width={asset.width ?? 400} height={asset.height ?? 300} className="aspect-video rounded-xl object-cover" /><p className="mt-3 text-sm text-starlight/70">{asset.usage ?? "General"}</p></Card>) : <Card>No media uploaded yet.</Card>}</div></main>;
}
