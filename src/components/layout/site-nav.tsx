import Image from "next/image";
import Link from "next/link";
import { Search, Shield } from "lucide-react";
import { auth } from "@/lib/auth";

const links = [
  ["Wiki", "/wiki"],
  ["Characters", "/characters"],
  ["Factions", "/factions"],
  ["Cosmology", "/cosmology"],
  ["Read", "/read"],
  ["Timeline", "/timeline"]
];

const logoUrl = process.env.NEXT_PUBLIC_SITE_LOGO_URL || "/cosmic-codex-logo.svg";

export async function SiteNav() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-bold tracking-wide text-white">
          <Image src={logoUrl} alt="Cosmic Codex logo" width={56} height={56} className="h-12 w-12 shrink-0 rounded-xl object-contain shadow-glow" priority />
          <span className="truncate text-sm sm:text-base">Eclipse of the Final Realm</span>
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
