import { BookOpen, Database, GitBranch, Image, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  [Database, "Lore Encyclopedia", "Unlimited categories, articles, tags, custom fields, and related pages for your manually authored canon."],
  [BookOpen, "Novel Platform", "Volumes, chapters, draft states, scheduling, bookmarks, reading progress, and navigation."],
  [Shield, "Admin Operations", "Role-based dashboard for creating, editing, publishing, uploading, and managing users."],
  [GitBranch, "Relationship Graph", "Entity-to-entity linking across characters, factions, articles, chapters, timelines, locations, and realms."],
  [Image, "Media Library", "Cloudinary-backed banners, portraits, maps, logos, and gallery images."],
  [Search, "Global Search", "Unified search across encyclopedia pages, chapters, characters, factions, and timeline events."]
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.32em] text-plasma">Official universe platform</p>
          <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">Eclipse of the Final Realm</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-starlight/75">A scalable, content-empty framework for a science-fantasy novel website that combines a fandom-style wiki, reading platform, lore encyclopedia, media vault, and administrative publishing suite.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/read">Start Reading</Button>
            <Button href="/wiki" variant="ghost">Explore Wiki</Button>
            <Button href="/admin" variant="ghost">Admin Dashboard</Button>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-cosmic-grid bg-[size:32px_32px] opacity-30" />
          <div className="relative space-y-5">
            <div className="h-48 rounded-2xl border border-white/10 bg-gradient-to-br from-eclipse/50 via-plasma/20 to-solar/20 shadow-glow" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 rounded-xl bg-white/10" />
              <div className="h-20 rounded-xl bg-white/10" />
              <div className="h-20 rounded-xl bg-white/10" />
            </div>
            <p className="text-sm text-starlight/70">No fictional content is included. Populate every article, character, faction, chapter, timeline, and media entry from the admin panel.</p>
          </div>
        </Card>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([Icon, title, text]) => <Card key={title as string}><Icon className="mb-4 h-6 w-6 text-solar" /><h2 className="text-xl font-bold text-white">{title as string}</h2><p className="mt-2 text-sm leading-6 text-starlight/70">{text as string}</p></Card>)}
      </section>
    </main>
  );
}
