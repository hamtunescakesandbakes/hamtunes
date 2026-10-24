import { NextResponse } from "next/server";
import { runSync } from "@/lib/sync/engine";
import { getSyncLogs, getSyncSettings, getAllAssets } from "@/lib/db";

export async function GET() {
  try {
    const settings = getSyncSettings();
    const logs = getSyncLogs();
    const assets = getAllAssets();

    const pendingReviewCount = assets.filter((a) => a.status === "needs_review").length;
    const publishedCount = assets.filter((a) => a.status === "published").length;

    return NextResponse.json({
      success: true,
      settings,
      stats: {
        total_assets: assets.length,
        published_count: publishedCount,
        pending_review_count: pendingReviewCount,
        last_sync: settings.last_sync_timestamp || (logs[0]?.timestamp ?? null),
      },
      recent_logs: logs.slice(0, 10),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await runSync("manual");
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
