import { Card } from "@/components/ui/card";

export default function SearchPage() {
  return <main className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-4xl font-black text-white">Global Search</h1><p className="mt-3 text-starlight/70">Search endpoint: <code>/api/search?q=term</code>. Wire this page to a client search box or external search provider when indexing grows.</p><Card className="mt-8"><form action="/api/search"><input name="q" placeholder="Search articles, chapters, characters, factions, timelines..." className="w-full rounded-xl border border-white/10 bg-void p-4 text-white" /></form></Card></main>;
}
