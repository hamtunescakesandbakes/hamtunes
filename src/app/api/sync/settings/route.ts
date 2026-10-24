import { NextResponse } from "next/server";
import { updateSyncSettings, getSyncSettings } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = updateSyncSettings({
      auto_publish_confident: body.auto_publish_confident,
      confidence_threshold: body.confidence_threshold,
    });
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
