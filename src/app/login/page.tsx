import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth, signIn } from "@/lib/auth";

async function loginWithCredentials(formData: FormData) {
  "use server";

  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/admin"
  });
}

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const params = await searchParams;
  const errorMessage = params?.error
    ? "Login failed. Check your email and password, then try again."
    : null;

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Card>
        <h1 className="text-3xl font-black text-white">Login</h1>
        <p className="mt-3 text-sm text-starlight/70">
          Sign in with your admin or editor account to manage the website.
        </p>
        <form action={loginWithCredentials} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-white/10 bg-void p-3 text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            minLength={8}
            className="w-full rounded-xl border border-white/10 bg-void p-3 text-white"
          />
          {errorMessage ? <p className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{errorMessage}</p> : null}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </Card>
    </main>
  );
}
