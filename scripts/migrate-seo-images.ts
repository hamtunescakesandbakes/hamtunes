import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "database.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const optDir = path.join(process.cwd(), "public", "uploads", "optimized");
const thumbDir = path.join(process.cwd(), "public", "uploads", "thumbs");

console.log(`Processing ${db.assets.length} assets and ${db.products.length} products...`);

let migrated = 0;

for (const asset of db.assets) {
  const cleanName = (asset.caption || asset.filename)
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const seoBase = `hamtunes-${cleanName}-${asset.hash.substring(0, 8)}`;
  const seoOptFilename = `${seoBase}.webp`;
  const seoThumbFilename = `${seoBase}_thumb.webp`;

  const oldOptPath = path.join(process.cwd(), "public", asset.web_url);
  const oldThumbPath = path.join(process.cwd(), "public", asset.thumbnail_url);

  const newOptPath = path.join(optDir, seoOptFilename);
  const newThumbPath = path.join(thumbDir, seoThumbFilename);

  // Copy if source exists
  if (fs.existsSync(oldOptPath)) {
    fs.copyFileSync(oldOptPath, newOptPath);
  }
  if (fs.existsSync(oldThumbPath)) {
    fs.copyFileSync(oldThumbPath, newThumbPath);
  }

  const oldWebUrl = asset.web_url;
  const newWebUrl = `/uploads/optimized/${seoOptFilename}`;
  const newThumbUrl = `/uploads/thumbs/${seoThumbFilename}`;

  asset.web_url = newWebUrl;
  asset.thumbnail_url = newThumbUrl;
  asset.alt_text = `${asset.caption} handcrafted by Hamtunes Cakes & Bakes`;

  // Update corresponding product
  for (const prod of db.products) {
    if (prod.primary_image_id === asset.id || prod.primary_image_url === oldWebUrl) {
      prod.primary_image_url = newWebUrl;
      prod.gallery_images = [newWebUrl];
      migrated++;
    }
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
console.log(`Successfully migrated ${db.assets.length} assets and updated ${migrated} products with descriptive SEO filenames and brand alt texts!`);
