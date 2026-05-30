import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function assertEditor() {
  const session = await auth();
  if (!session?.user?.id || !["ADMIN", "EDITOR"].includes(session.user.role ?? "")) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}
