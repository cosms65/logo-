import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleSchema = z.object({ userId: z.string(), role: z.enum(["USER", "EDITOR", "ADMIN"]) });

async function assertAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function PATCH(request: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = roleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const user = await prisma.user.update({ where: { id: parsed.data.userId }, data: { role: parsed.data.role }, select: { id: true, email: true, role: true } });
  return NextResponse.json(user);
}
