import { NextResponse } from "next/server";
import { updateAsset, getAssetById } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = getAssetById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Asset not found" }, { status: 404 });
    }

    const updated = updateAsset(id, {
      status: body.status !== undefined ? body.status : existing.status,
      category: body.category !== undefined ? body.category : existing.category,
      caption: body.caption !== undefined ? body.caption : existing.caption,
      alt_text: body.alt_text !== undefined ? body.alt_text : existing.alt_text,
      is_featured: body.is_featured !== undefined ? body.is_featured : existing.is_featured,
      review_notes: body.review_notes !== undefined ? body.review_notes : existing.review_notes,
    });

    return NextResponse.json({ success: true, asset: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
