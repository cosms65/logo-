import { NextResponse } from "next/server";
import { assertEditor } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guard = await assertEditor();
  if (guard.error) return guard.error;
  return NextResponse.json(await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 }));
}
