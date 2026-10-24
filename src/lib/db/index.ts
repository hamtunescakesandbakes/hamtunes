import fs from "fs";
import path from "path";
import { Asset, Product, Enquiry, SyncLogEntry, SyncSettings, WebsiteSettings } from "../types";
import { BRAND } from "../constants";

interface DatabaseSchema {
  version: number;
  assets: Asset[];
  products: Product[];
  enquiries: Enquiry[];
  syncSettings: SyncSettings;
  syncLogs: SyncLogEntry[];
  websiteSettings: WebsiteSettings;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

const DEFAULT_SETTINGS: WebsiteSettings = {
  phone_number: BRAND.phoneDisplay,
  whatsapp_number: BRAND.whatsAppNumber,
  email: BRAND.email,
  instagram_url: BRAND.instagramUrl,
  experience_years: BRAND.experienceYears,
  is_accepting_orders: true,
};

const DEFAULT_SYNC_SETTINGS: SyncSettings = {
  auto_publish_confident: true,
  confidence_threshold: 0.8,
};

import seedData from "../../../data/database.json";

function initDB(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    try {
      fs.mkdirSync(DB_DIR, { recursive: true });
    } catch {}
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      console.error("Error reading database.json, using bundled seed data:", err);
    }
  }

  return (seedData as unknown) as DatabaseSchema;
}

// In-memory cache
let dbCache: DatabaseSchema | null = null;

function getDB(): DatabaseSchema {
  if (!dbCache) {
    dbCache = initDB();
  }
  return dbCache;
}

function saveDB(db: DatabaseSchema) {
  dbCache = db;
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  // Write to temporary file first then rename for atomic write
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

import { getProductDisplayPrice, calculateRecommendedPrice } from "../pricing";

/* ================= PRODUCTS ================= */
/**
 * Strips confidential production costs & target margins from products for public website consumption.
 */
export function sanitizeProductForPublic(product: Product): Product {
  const { private_costs, ...safeProduct } = product;
  return {
    ...safeProduct,
    price_display: getProductDisplayPrice(product),
  };
}

/**
 * Returns all products with private cost and margin metrics for authorized administrators.
 */
export function getAllAdminProducts(): Product[] {
  const db = getDB();
  return [...db.products]
    .map((p) => ({
      ...p,
      price_display: getProductDisplayPrice(p),
    }))
    .sort((a, b) => a.order_rank - b.order_rank);
}

/**
 * Returns sanitized published products for the public website and customer APIs.
 */
export function getAllProducts(): Product[] {
  const db = getDB();
  return db.products
    .filter((p) => p.is_published)
    .map(sanitizeProductForPublic)
    .sort((a, b) => a.order_rank - b.order_rank);
}

export function getPublishedProducts(): Product[] {
  return getAllProducts();
}

export function getProductById(id: string): Product | undefined {
  const p = getDB().products.find((p) => p.id === id);
  return p ? sanitizeProductForPublic(p) : undefined;
}

export function getAdminProductById(id: string): Product | undefined {
  return getDB().products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const p = getDB().products.find((p) => p.slug === slug);
  return p ? sanitizeProductForPublic(p) : undefined;
}

export function saveProduct(product: Product): Product {
  const db = getDB();

  // If private costs are provided, calculate recommended price
  let privateCosts = product.private_costs;
  if (privateCosts && privateCosts.unit_cost && privateCosts.target_gross_margin) {
    const calc = calculateRecommendedPrice(
      privateCosts.unit_cost,
      privateCosts.target_gross_margin
    );
    privateCosts = {
      ...privateCosts,
      recommended_price: calc.recommendedPrice,
    };
  }

  const updatedProduct: Product = {
    ...product,
    pricing_method: product.pricing_method || "starting_at",
    currency: "NGN",
    is_price_approved: Boolean(product.is_price_approved),
    private_costs: privateCosts,
    price_display: getProductDisplayPrice(product),
    updated_at: new Date().toISOString(),
  };

  const index = db.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    db.products[index] = updatedProduct;
  } else {
    db.products.push({
      ...updatedProduct,
      created_at: product.created_at || new Date().toISOString(),
    });
  }
  saveDB(db);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const db = getDB();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    saveDB(db);
    return true;
  }
  return false;
}

/* ================= ASSETS ================= */
export function getAllAssets(): Asset[] {
  return [...getDB().assets];
}

export function getPublishedAssets(): Asset[] {
  return getDB().assets.filter((a) => a.status === "published");
}

export function getAssetById(id: string): Asset | undefined {
  return getDB().assets.find((a) => a.id === id);
}

export function getAssetByHash(hash: string): Asset | undefined {
  return getDB().assets.find((a) => a.hash === hash);
}

export function saveAsset(asset: Asset): Asset {
  const db = getDB();
  const index = db.assets.findIndex((a) => a.id === asset.id);
  if (index >= 0) {
    db.assets[index] = { ...asset, updated_at: new Date().toISOString() };
  } else {
    db.assets.push(asset);
  }
  saveDB(db);
  return asset;
}

export function saveAssetsBatch(assets: Asset[]) {
  const db = getDB();
  for (const asset of assets) {
    const idx = db.assets.findIndex((a) => a.id === asset.id);
    if (idx >= 0) {
      db.assets[idx] = { ...asset, updated_at: new Date().toISOString() };
    } else {
      db.assets.push(asset);
    }
  }
  saveDB(db);
}

export function updateAsset(id: string, updates: Partial<Asset>): Asset | undefined {
  const db = getDB();
  const index = db.assets.findIndex((a) => a.id === id);
  if (index >= 0) {
    const existing = db.assets[index]!;
    db.assets[index] = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDB(db);
    return db.assets[index];
  }
  return undefined;
}

/* ================= ENQUIRIES ================= */
export function getAllEnquiries(): Enquiry[] {
  return [...getDB().enquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getEnquiryById(id: string): Enquiry | undefined {
  return getDB().enquiries.find((e) => e.id === id);
}

export function createEnquiry(enquiry: Omit<Enquiry, "id" | "created_at" | "updated_at">): Enquiry {
  const db = getDB();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: enquiry.status || "new",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  db.enquiries.unshift(newEnquiry);
  saveDB(db);
  return newEnquiry;
}

export function updateEnquiry(
  id: string,
  updates: Partial<Pick<Enquiry, "status" | "internal_notes">>
): Enquiry | undefined {
  const db = getDB();
  const idx = db.enquiries.findIndex((e) => e.id === id);
  if (idx >= 0) {
    const existing = db.enquiries[idx]!;
    db.enquiries[idx] = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveDB(db);
    return db.enquiries[idx];
  }
  return undefined;
}

/* ================= SETTINGS & SYNC ================= */
export function getSyncSettings(): SyncSettings {
  return getDB().syncSettings || DEFAULT_SYNC_SETTINGS;
}

export function updateSyncSettings(settings: Partial<SyncSettings>): SyncSettings {
  const db = getDB();
  db.syncSettings = { ...db.syncSettings, ...settings };
  saveDB(db);
  return db.syncSettings;
}

export function getSyncLogs(): SyncLogEntry[] {
  return [...(getDB().syncLogs || [])].reverse();
}

export function addSyncLog(log: SyncLogEntry) {
  const db = getDB();
  if (!db.syncLogs) db.syncLogs = [];
  db.syncLogs.push(log);
  // Keep last 100 logs
  if (db.syncLogs.length > 100) {
    db.syncLogs = db.syncLogs.slice(-100);
  }
  saveDB(db);
}

export function getWebsiteSettings(): WebsiteSettings {
  return getDB().websiteSettings || DEFAULT_SETTINGS;
}

export function updateWebsiteSettings(settings: Partial<WebsiteSettings>): WebsiteSettings {
  const db = getDB();
  db.websiteSettings = { ...db.websiteSettings, ...settings };
  saveDB(db);
  return db.websiteSettings;
}
