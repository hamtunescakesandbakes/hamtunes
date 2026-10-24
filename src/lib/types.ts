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
  price_display?: string; // Optional price or custom quote indicator
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
