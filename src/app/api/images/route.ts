import { NextResponse } from "next/server";
import { getAllAssets, saveAsset } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";

    let assets = getAllAssets();

    if (division) {
      assets = assets.filter((a) => a.division === division);
    }
    if (status) {
      assets = assets.filter((a) => a.status === status);
    }
    if (category && category !== "all") {
      assets = assets.filter((a) => a.category === category);
    }
    if (featuredOnly) {
      assets = assets.filter((a) => a.is_featured);
    }

    return NextResponse.json({ success: true, count: assets.length, assets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Upload reference photo or custom image
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "customer");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const hash = crypto.createHash("md5").update(buffer).digest("hex").substring(0, 12);
    const filename = `${Date.now()}_${hash}.webp`;
    const targetPath = path.join(uploadsDir, filename);

    // Optimize and save reference image
    await sharp(buffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(targetPath);

    const publicUrl = `/uploads/customer/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
