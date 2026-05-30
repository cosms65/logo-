import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return <main className="mx-auto max-w-md px-4 py-16"><Card><h1 className="text-3xl font-black text-white">Login</h1><form action="/api/auth/signin/credentials" method="post" className="mt-6 space-y-4"><input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" /><input name="password" type="password" placeholder="Password" className="w-full rounded-xl border border-white/10 bg-void p-3 text-white" /><Button type="submit" className="w-full">Sign in</Button></form></Card></main>;
}
