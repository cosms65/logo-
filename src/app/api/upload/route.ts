import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  file: z.string().min(1),
  altText: z.string().optional(),
  usage: z.string().optional()
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !["ADMIN", "EDITOR"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const upload = await cloudinary.uploader.upload(parsed.data.file, { folder: "eclipse-final-realm" });
    const asset = await prisma.mediaAsset.create({
      data: {
        publicId: upload.public_id,
        url: upload.url,
        secureUrl: upload.secure_url,
        format: upload.format,
        width: upload.width,
        height: upload.height,
        altText: parsed.data.altText,
        usage: parsed.data.usage,
        uploadedById: session.user.id
      }
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: `Cloudinary upload failed: ${message}. Check your Cloudinary credentials in .env.` }, { status: 502 });
  }
}
