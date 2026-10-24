import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import {
  getAllAssets,
  saveAsset,
  getAssetByHash,
  getSyncSettings,
  addSyncLog,
  getAllProducts,
  saveProduct,
  updateSyncSettings,
} from "../db";
import { classifyImage } from "./classifier";
import { Asset, AssetStatus, Product, SyncLogEntry } from "../types";
import { BRAND } from "../constants";

export interface SyncEngineResult {
  success: boolean;
  files_scanned: number;
  files_added: number;
  files_updated: number;
  duplicates_skipped: number;
  needs_review_count: number;
  errors: string[];
  duration_ms: number;
  timestamp: string;
}

const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function computeFileHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex").substring(0, 16);
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Executes a full scan and synchronization of the Website Assets directory
 */
export async function runSync(trigger: "manual" | "watcher" | "initial_import" = "manual"): Promise<SyncEngineResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  let files_scanned = 0;
  let files_added = 0;
  let files_updated = 0;
  let duplicates_skipped = 0;
  let needs_review_count = 0;

  const assetsDir = path.join(process.cwd(), "Website Assets");
  const publicDir = path.join(process.cwd(), "public");
  const uploadsOptDir = path.join(publicDir, "uploads", "optimized");
  const uploadsThumbDir = path.join(publicDir, "uploads", "thumbs");
  const brandImgDir = path.join(publicDir, "images");

  ensureDir(uploadsOptDir);
  ensureDir(uploadsThumbDir);
  ensureDir(brandImgDir);

  if (!fs.existsSync(assetsDir)) {
    return {
      success: false,
      files_scanned: 0,
      files_added: 0,
      files_updated: 0,
      duplicates_skipped: 0,
      needs_review_count: 0,
      errors: [`Website Assets directory not found at: ${assetsDir}`],
      duration_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  const syncSettings = getSyncSettings();
  const autoPublish = syncSettings.auto_publish_confident ?? true;
  const threshold = syncSettings.confidence_threshold ?? 0.8;

  // Collect all files recursively
  function getFilesRecursively(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFilePaths = getFilesRecursively(assetsDir);
  const seenHashesInRun = new Set<string>();

  for (const filePath of allFilePaths) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      continue;
    }

    files_scanned++;
    const filename = path.basename(filePath);
    const parentFolder = path.basename(path.dirname(filePath));

    try {
      const hash = computeFileHash(filePath);

      // Duplicate check within current scan run
      if (seenHashesInRun.has(hash)) {
        duplicates_skipped++;
        continue;
      }
      seenHashesInRun.add(hash);

      // Check if hash already exists in DB
      const existingAsset = getAssetByHash(hash);
      if (existingAsset) {
        // If file was already indexed and exists, verify web URLs
        const optPath = path.join(publicDir, existingAsset.web_url);
        if (!fs.existsSync(optPath)) {
          // Regenerate web image if missing
          const cleanSlug = (existingAsset.caption || filename)
            .replace(/\.[^/.]+$/, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          await generateOptimizedImages(filePath, hash, uploadsOptDir, uploadsThumbDir, cleanSlug);
          files_updated++;
        }
        duplicates_skipped++;
        continue;
      }

      // Read image metadata
      const imageInfo = await sharp(filePath).metadata();
      const width = imageInfo.width || 800;
      const height = imageInfo.height || 800;
      const stat = fs.statSync(filePath);

      // Classify the image first for SEO naming & metadata
      const classification = classifyImage(filename, parentFolder);
      const isFeatured = parentFolder.toLowerCase().includes("featured");

      const cleanSlug = (classification.caption || filename)
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Generate optimized WebP web version & thumbnail with descriptive SEO filename
      const { webUrl, thumbUrl } = await generateOptimizedImages(
        filePath,
        hash,
        uploadsOptDir,
        uploadsThumbDir,
        cleanSlug
      );

      // Handle brand assets for static UI
      if (parentFolder.toLowerCase().includes("brand identity") || filename.toLowerCase().includes("logo")) {
        fs.copyFileSync(filePath, path.join(brandImgDir, "logo.png"));
      } else if (parentFolder.toLowerCase().includes("brand photography") || filename.toLowerCase().includes("owner")) {
        fs.copyFileSync(filePath, path.join(brandImgDir, "owner.jpg"));
      }

      let status: AssetStatus = "needs_review";
      if (classification.is_brand_asset) {
        status = "approved";
      } else if (autoPublish && classification.confidence_score >= threshold) {
        status = "published";
      } else {
        status = "needs_review";
        needs_review_count++;
      }

      const assetId = `ast_${hash}`;
      const newAsset: Asset = {
        id: assetId,
        filename,
        original_folder: parentFolder,
        original_path: path.relative(process.cwd(), filePath),
        web_url: webUrl,
        thumbnail_url: thumbUrl,
        width,
        height,
        file_size: stat.size,
        hash,
        suggested_category: classification.suggested_category,
        category: classification.suggested_category,
        division: classification.division,
        caption: classification.caption,
        alt_text: classification.alt_text,
        status,
        is_featured: isFeatured,
        confidence_score: classification.confidence_score,
        review_notes: classification.notes,
        detected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveAsset(newAsset);
      files_added++;

      // If published, automatically ensure a corresponding product entry exists in the catalogue!
      if (status === "published" && !classification.is_brand_asset) {
        syncProductForAsset(newAsset);
      }
    } catch (err: any) {
      console.error(`Error processing asset ${filePath}:`, err);
      errors.push(`${filename}: ${err.message || String(err)}`);
    }
  }

  const duration_ms = Date.now() - startTime;
  const result: SyncEngineResult = {
    success: errors.length === 0,
    files_scanned,
    files_added,
    files_updated,
    duplicates_skipped,
    needs_review_count,
    errors,
    duration_ms,
    timestamp: new Date().toISOString(),
  };

  // Record log
  const logEntry: SyncLogEntry = {
    id: `sync_${Date.now()}`,
    timestamp: result.timestamp,
    trigger,
    files_scanned,
    files_added,
    files_updated,
    duplicates_skipped,
    needs_review_count,
    errors,
    duration_ms,
  };
  addSyncLog(logEntry);
  updateSyncSettings({ last_sync_timestamp: result.timestamp });

  return result;
}

/**
 * Generates an optimized WebP image and thumbnail
 */
async function generateOptimizedImages(
  srcPath: string,
  hash: string,
  optDir: string,
  thumbDir: string,
  seoSlug?: string
): Promise<{ webUrl: string; thumbUrl: string }> {
  const baseName = seoSlug ? `hamtunes-${seoSlug}-${hash.substring(0, 8)}` : hash;
  const optFilename = `${baseName}.webp`;
  const thumbFilename = `${baseName}_thumb.webp`;

  const optFullPath = path.join(optDir, optFilename);
  const thumbFullPath = path.join(thumbDir, thumbFilename);

  // Optimized web display: max 1600px width/height, WebP, quality 85
  await sharp(srcPath)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(optFullPath);

  // Also maintain legacy hash-only alias for backwards compatibility
  if (baseName !== hash) {
    const legacyOptPath = path.join(optDir, `${hash}.webp`);
    if (!fs.existsSync(legacyOptPath)) {
      try {
        fs.copyFileSync(optFullPath, legacyOptPath);
      } catch (_) {}
    }
  }

  // Thumbnail: 500x500 square or cropped fit, WebP, quality 80
  await sharp(srcPath)
    .resize(500, 500, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(thumbFullPath);

  return {
    webUrl: `/uploads/optimized/${optFilename}`,
    thumbUrl: `/uploads/thumbs/${thumbFilename}`,
  };
}

import { CATEGORY_PRICING_GUIDELINES } from "../pricing";

/**
 * Creates or updates a public Product entry corresponding to an approved/published asset
 */
function syncProductForAsset(asset: Asset) {
  const existingProducts = getAllProducts();
  const slug = asset.caption
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existing = existingProducts.find((p) => p.slug === slug || p.primary_image_id === asset.id);

  if (existing) {
    saveProduct({
      ...existing,
      primary_image_url: asset.web_url,
      is_featured: asset.is_featured || existing.is_featured,
      updated_at: new Date().toISOString(),
    });
  } else {
    const isCake = asset.division === "cakes";
    const pricingGuideline = CATEGORY_PRICING_GUIDELINES[asset.category];

    const product: Product = {
      id: `prod_${asset.hash}`,
      name: asset.caption,
      slug,
      division: isCake ? "cakes" : "bakes_and_small_chops",
      category: asset.category,
      description: `${asset.caption} handcrafted with precision, passion, and ${BRAND.experienceYears} of Hamtunes baking expertise. Available for custom orders and events.`,
      primary_image_id: asset.id,
      primary_image_url: asset.web_url,
      gallery_images: [asset.web_url],

      // Pricing structure — Marked as Pending Owner Approval
      pricing_method: pricingGuideline?.defaultMethod || (isCake ? "starting_at" : "per_unit"),
      currency: "NGN",
      base_price: pricingGuideline?.suggestedBasePrice,
      max_price: pricingGuideline?.suggestedMaxPrice,
      unit_label: pricingGuideline?.unitLabel || (isCake ? "cake" : "piece"),
      quantity_tiers: pricingGuideline?.defaultTiers || [],
      price_notes: pricingGuideline?.pricingNotes || "Pricing tailored to confirmed order specifications",
      is_price_approved: false, // Critical: Pending Owner Approval

      // Private cost & margin calculations (Strictly internal)
      private_costs: {
        unit_cost: pricingGuideline?.suggestedUnitCost,
        target_gross_margin: pricingGuideline?.suggestedTargetMargin || 0.50,
        recommended_price: pricingGuideline?.suggestedBasePrice,
        cost_notes: "Initial market-informed estimate based on Lagos premium bakery benchmarks. Pending owner confirmation.",
      },

      is_featured: asset.is_featured,
      is_published: true,
      tags: [asset.category, isCake ? "Cake" : "Bakes", "Celebration", "Custom"],
      order_rank: asset.is_featured ? 1 : 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveProduct(product);
  }
}
