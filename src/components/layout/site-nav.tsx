import Link from "next/link";
import { BookOpen, Eclipse, Search, Shield } from "lucide-react";
import { auth } from "@/lib/auth";

const links = [
  ["Wiki", "/wiki"],
  ["Characters", "/characters"],
  ["Factions", "/factions"],
  ["Read", "/read"],
  ["Timeline", "/timeline"]
];

export async function SiteNav() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-wide text-white">
          <Eclipse className="h-6 w-6 text-solar" /> Eclipse of the Final Realm
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="text-sm text-starlight/80 hover:text-white">{label}</Link>)}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/search" aria-label="Search" className="rounded-lg border border-white/10 p-2 text-starlight/80 hover:text-white"><Search className="h-4 w-4" /></Link>
          {session?.user?.role === "ADMIN" ? <Link href="/admin" aria-label="Admin" className="rounded-lg border border-white/10 p-2 text-solar"><Shield className="h-4 w-4" /></Link> : null}
          <Link href={session ? "/api/auth/signout" : "/login"} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
            {session ? "Account" : "Login"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
