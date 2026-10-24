export type AssetStatus =
  | "detected"
  | "processing"
  | "needs_review"
  | "approved"
  | "published"
  | "archived"
  | "failed";

export type Division = "cakes" | "bakes_and_small_chops" | "brand";

export interface Asset {
  id: string;
  filename: string;
  original_folder: string; // "Cakes", "Deserts and Baked Goods", "Featured Cakes and Bakes", "Brand Identity", "Brand Photography"
  original_path: string;
  web_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  file_size: number;
  hash: string;
  suggested_category: string;
  category: string;
  division: Division;
  caption: string;
  alt_text: string;
  status: AssetStatus;
  is_featured: boolean;
  confidence_score: number; // 0 to 1
  review_notes?: string;
  detected_at: string;
  updated_at: string;
}

export type PricingMethod =
  | "fixed"
  | "starting_at"
  | "per_unit"
  | "quantity_tiers"
  | "price_range"
  | "quote_only";

export interface QuantityTier {
  quantity: number;
  label: string; // e.g., "Box of 6", "Pack of 12", "50 pieces"
  price: number; // in NGN
}

export interface PrivateCosts {
  unit_cost?: number; // Total direct production cost in NGN (strictly internal)
  target_gross_margin?: number; // e.g. 0.50 (50%)
  recommended_price?: number; // Calculated: unit_cost / (1 - margin)
  cost_notes?: string; // Private admin notes on ingredients, packaging, labour
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  division: "cakes" | "bakes_and_small_chops";
  category: string;
  description: string;
  primary_image_id: string;
  primary_image_url: string;
  gallery_images: string[];
  
  // Pricing System
  pricing_method: PricingMethod;
  currency: "NGN";
  base_price?: number; // in NGN
  max_price?: number; // for price_range
  unit_label?: string; // e.g., "piece", "cake", "tray", "box"
  quantity_tiers?: QuantityTier[];
  price_notes?: string; // e.g., "Varies by tier count, complexity, and custom topper"
  is_price_approved: boolean; // false = Pending Owner Approval; true = Approved & Public
  price_display?: string; // Formatted display text (e.g., "From ₦35,000")
  
  // Private Cost & Margin Fields (Stripped in public API responses)
  private_costs?: PrivateCosts;

  is_featured: boolean;
  is_published: boolean;
  tags: string[];
  order_rank: number;
  created_at: string;
  updated_at: string;
}

export type EnquiryType =
  | "general"
  | "cake"
  | "gifting_cake"
  | "bakes_and_small_chops"
  | "event"
  | "event_planner";

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "archived";

export interface Enquiry {
  id: string;
  enquiry_type: EnquiryType;
  customer_name: string;
  phone_number: string;
  email?: string;
  business_name?: string; // For event planners
  product_categories: string[];
  products_interested?: string;
  event_date?: string;
  cake_size_or_quantity?: string;
  design_notes?: string;
  budget_range?: string;
  reference_image_url?: string;
  collection_or_delivery?: "collection" | "delivery" | "undecided";
  status: EnquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  trigger: "manual" | "watcher" | "initial_import";
  files_scanned: number;
  files_added: number;
  files_updated: number;
  duplicates_skipped: number;
  needs_review_count: number;
  errors: string[];
  duration_ms: number;
}

export interface SyncSettings {
  auto_publish_confident: boolean;
  confidence_threshold: number; // e.g. 0.85
  last_sync_timestamp?: string;
}

export interface WebsiteSettings {
  phone_number: string;
  whatsapp_number: string;
  email: string;
  instagram_url: string;
  experience_years: number;
  announcement_banner?: string;
  is_accepting_orders: boolean;
}
