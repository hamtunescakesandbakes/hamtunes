import chokidar from "chokidar";
import path from "path";
import { runSync } from "./engine";

const WATCH_DIR = path.join(process.cwd(), "Website Assets");

console.log("==================================================");
console.log(" 👁️ HAMTUNES PHOTO WATCHER - REAL-TIME SYNC");
console.log(` Watching directory: ${WATCH_DIR}`);
console.log(" Drop images into folder to sync automatically!");
console.log(" Press Ctrl+C to terminate watcher.");
console.log("==================================================");

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function triggerDebouncedSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(async () => {
    console.log(`\n[${new Date().toLocaleTimeString()}] 🔄 Change detected in Website Assets. Running sync...`);
    try {
      const result = await runSync("watcher");
      console.log(
        `[${new Date().toLocaleTimeString()}] ✅ Sync finished: +${result.files_added} added, ${result.files_updated} updated, ${result.duplicates_skipped} duplicates skipped.`
      );
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Watcher sync failed:`, err);
    }
  }, 1200); // 1.2 second debounce to allow file write to finish
}

const watcher = chokidar.watch(WATCH_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true, // Don't trigger on startup, wait for changes
  awaitWriteFinish: {
    stabilityThreshold: 1500,
    pollInterval: 200,
  },
});

watcher
  .on("add", (filePath) => {
    console.log(`📸 New file detected: ${path.basename(filePath)}`);
    triggerDebouncedSync();
  })
  .on("change", (filePath) => {
    console.log(`📝 File modified: ${path.basename(filePath)}`);
    triggerDebouncedSync();
  })
  .on("error", (error) => {
    console.error(`Watcher error:`, error);
  });
