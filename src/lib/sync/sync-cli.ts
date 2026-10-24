import { runSync } from "./engine";

async function main() {
  console.log("==================================================");
  console.log(" 🎂 HAMTUNES CAKES & BAKES - ASSET SYNCHRONISATION");
  console.log("==================================================");
  console.log("Scanning folder: Website Assets/ ...");

  try {
    const result = await runSync("manual");

    console.log("\n✅ Synchronisation Complete!");
    console.log(`- Files Scanned: ${result.files_scanned}`);
    console.log(`- New Assets Added: ${result.files_added}`);
    console.log(`- Assets Updated: ${result.files_updated}`);
    console.log(`- Duplicates Skipped: ${result.duplicates_skipped}`);
    console.log(`- Marked for Review: ${result.needs_review_count}`);
    console.log(`- Duration: ${(result.duration_ms / 1000).toFixed(2)}s`);

    if (result.errors.length > 0) {
      console.log("\n⚠️ Errors Encountered:");
      result.errors.forEach((err) => console.log(`  - ${err}`));
    }
  } catch (error) {
    console.error("❌ Fatal error during synchronisation:", error);
    process.exit(1);
  }
}

main();
