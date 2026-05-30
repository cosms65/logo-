import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return <main className="mx-auto max-w-md px-4 py-16"><Card><h1 className="text-3xl font-black text-white">Register</h1><p className="mt-3 text-sm text-starlight/70">POST to <code>/api/register</code> with name, email, and password. In production, restrict this with invites or email verification.</p></Card></main>;
}
