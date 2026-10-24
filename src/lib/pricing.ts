import { PricingMethod, QuantityTier, Product } from "./types";

/**
 * Formats a number into Nigerian Naira string (e.g. ₦35,000)
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₦0";
  }
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

/**
 * Calculates recommended selling price based on total unit cost and target gross margin.
 * Formula: Selling Price = Total Unit Cost / (1 - Target Gross Margin)
 * Example: Cost = ₦4,000, Margin = 50% (0.50) => ₦4,000 / 0.50 = ₦8,000
 */
export function calculateRecommendedPrice(
  unitCost: number,
  targetGrossMargin: number
): { recommendedPrice: number; grossProfit: number; effectiveMargin: number } {
  if (!unitCost || unitCost <= 0) {
    return { recommendedPrice: 0, grossProfit: 0, effectiveMargin: 0 };
  }

  // Cap margin strictly below 100% to prevent division by zero
  const margin = Math.min(Math.max(targetGrossMargin, 0.05), 0.95);
  const recommendedPrice = Math.round((unitCost / (1 - margin)) / 100) * 100; // round to nearest ₦100
  const grossProfit = recommendedPrice - unitCost;
  const effectiveMargin = recommendedPrice > 0 ? grossProfit / recommendedPrice : 0;

  return { recommendedPrice, grossProfit, effectiveMargin };
}

/**
 * Formats the public display price for a product.
 * If the price is NOT approved by the owner, or is quote_only, returns a customer-friendly quote prompt.
 */
export function getProductDisplayPrice(product: Partial<Product>): string {
  // If price is not approved by owner or explicitly quote_only, don't show an unverified price
  if (!product.is_price_approved || product.pricing_method === "quote_only") {
    if (product.division === "cakes") {
      return "Custom Quote (Varies by Size & Design)";
    }
    return "Price on Consultation";
  }

  const method = product.pricing_method || "starting_at";
  const basePrice = product.base_price || 0;
  const maxPrice = product.max_price || 0;
  const unitLabel = product.unit_label || "piece";

  switch (method) {
    case "fixed":
      return formatNaira(basePrice);

    case "starting_at":
      return `From ${formatNaira(basePrice)}`;

    case "per_unit":
      return `${formatNaira(basePrice)} / ${unitLabel}`;

    case "price_range":
      if (maxPrice > basePrice) {
        return `${formatNaira(basePrice)} – ${formatNaira(maxPrice)}`;
      }
      return formatNaira(basePrice);

    case "quantity_tiers":
      if (product.quantity_tiers && product.quantity_tiers.length > 0) {
        const lowestTier = product.quantity_tiers[0];
        return `From ${formatNaira(lowestTier.price)} (${lowestTier.label})`;
      }
      return formatNaira(basePrice);

    default:
      return "Request a Quote";
  }
}

/**
 * Market-informed benchmark price guidelines for the Nigerian market (Lagos & premium tier).
 * Used by the classifier and sync engine to recommend starting points PENDING OWNER APPROVAL.
 */
export interface CategoryPricingGuideline {
  defaultMethod: PricingMethod;
  suggestedUnitCost: number;
  suggestedTargetMargin: number; // e.g. 0.50 (50%)
  suggestedBasePrice: number;
  suggestedMaxPrice?: number;
  unitLabel?: string;
  defaultTiers?: QuantityTier[];
  pricingNotes: string;
}

export const CATEGORY_PRICING_GUIDELINES: Record<string, CategoryPricingGuideline> = {
  // 1. Birthday Cakes (Custom tiered or decorated, 6"-10")
  birthday_cakes: {
    defaultMethod: "starting_at",
    suggestedUnitCost: 17500,
    suggestedTargetMargin: 0.50, // 50% gross margin
    suggestedBasePrice: 35000,   // Starting price for standard 8" single-tier custom design
    suggestedMaxPrice: 75000,
    unitLabel: "cake",
    pricingNotes: "Starting price for single-tier 8-inch cake. Multi-tier and structural themes quoted on request.",
  },

  // 2. Cakes for Gifting (Bento, mini celebration, personalized small cakes)
  gifting_cakes: {
    defaultMethod: "starting_at",
    suggestedUnitCost: 6500,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 13000,   // Premium gifting mini cake with presentation box & inscription
    suggestedMaxPrice: 22000,
    unitLabel: "cake",
    pricingNotes: "Includes personalized custom inscription and gift presentation packaging.",
  },

  // 3. Cultural Celebration Cakes (Traditional weddings, engagement, heritage)
  cultural_cakes: {
    defaultMethod: "starting_at",
    suggestedUnitCost: 35000,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 70000,
    suggestedMaxPrice: 150000,
    unitLabel: "cake",
    pricingNotes: "Price tailored according to intricate traditional motifs, tiers, and celebration size.",
  },

  // 4. Custom & Wedding Cakes (Multi-tier, milestone 50th, elaborate themes)
  custom_cakes: {
    defaultMethod: "quote_only",
    suggestedUnitCost: 45000,
    suggestedTargetMargin: 0.55,
    suggestedBasePrice: 90000,
    unitLabel: "cake",
    pricingNotes: "Bespoke quotation based on confirmed tier count, structure, delivery venue, and finish.",
  },

  // 5. Doughnuts (Glazed, rainbow sprinkle, jelly-filled)
  doughnuts: {
    defaultMethod: "quantity_tiers",
    suggestedUnitCost: 550,
    suggestedTargetMargin: 0.54,
    suggestedBasePrice: 1200,
    unitLabel: "doughnut",
    defaultTiers: [
      { quantity: 1, label: "Single Piece", price: 1200 },
      { quantity: 6, label: "Box of 6", price: 7000 },
      { quantity: 12, label: "Box of 12 (Party Pack)", price: 13500 },
    ],
    pricingNotes: "Freshly fried & glazed daily. Bulk discounts apply to 24+ pieces for events.",
  },

  // 6. Cupcakes (Artisan decorated with whipped buttercream/fondant)
  cupcakes: {
    defaultMethod: "quantity_tiers",
    suggestedUnitCost: 850,
    suggestedTargetMargin: 0.53,
    suggestedBasePrice: 1800,
    unitLabel: "cupcake",
    defaultTiers: [
      { quantity: 6, label: "Box of 6 Artisan Cupcakes", price: 10500 },
      { quantity: 12, label: "Box of 12 Celebration Box", price: 20000 },
      { quantity: 24, label: "Party Tray of 24", price: 38000 },
    ],
    pricingNotes: "Packaged in bakery display boxes with custom color themes available.",
  },

  // 7. Meat Pies & Savory Hand Pies (Flaky pastry, rich beef & potato)
  meat_pies: {
    defaultMethod: "per_unit",
    suggestedUnitCost: 700,
    suggestedTargetMargin: 0.53,
    suggestedBasePrice: 1500,
    unitLabel: "piece",
    defaultTiers: [
      { quantity: 1, label: "Single Pie", price: 1500 },
      { quantity: 6, label: "Pack of 6", price: 8500 },
      { quantity: 12, label: "Dozen Pack", price: 16500 },
    ],
    pricingNotes: "Generously filled with seasoned minced beef, potatoes, and carrots in golden crust.",
  },

  // 8. Sausage Rolls (Crisp puff pastry with spiced sausage)
  sausage_rolls: {
    defaultMethod: "per_unit",
    suggestedUnitCost: 550,
    suggestedTargetMargin: 0.54,
    suggestedBasePrice: 1200,
    unitLabel: "piece",
    defaultTiers: [
      { quantity: 1, label: "Single Roll", price: 1200 },
      { quantity: 6, label: "Pack of 6", price: 7000 },
      { quantity: 12, label: "Pack of 12", price: 13500 },
    ],
    pricingNotes: "Golden flaky puff pastry baked fresh with seasoned filling.",
  },

  // 9. Small Chops & Finger Foods (Puff-puff, spring rolls, samosas, platters)
  small_chops: {
    defaultMethod: "quantity_tiers",
    suggestedUnitCost: 10000,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 20000,
    unitLabel: "pack",
    defaultTiers: [
      { quantity: 1, label: "Midi Party Pack (25 pcs)", price: 18000 },
      { quantity: 1, label: "Standard Party Platter (50 pcs)", price: 32000 },
      { quantity: 1, label: "Grand Celebration Platter (100 pcs)", price: 60000 },
    ],
    pricingNotes: "Includes assorted puff-puff, crunchy spring rolls, spiced samosas, and dipping sauces.",
  },

  // 10. Party & Bulk Orders / Event Catering
  party_bulk: {
    defaultMethod: "quote_only",
    suggestedUnitCost: 25000,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 50000,
    unitLabel: "event package",
    pricingNotes: "Custom quotation tailored to your guest count, delivery venue, and menu selection.",
  },

  // 11. Nigerian Egg Rolls
  egg_rolls: {
    defaultMethod: "quantity_tiers",
    suggestedUnitCost: 400,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 800,
    unitLabel: "piece",
    defaultTiers: [
      { quantity: 1, label: "Single Piece", price: 800 },
      { quantity: 6, label: "Box of 6", price: 4500 },
      { quantity: 12, label: "Baker's Dozen (12 pcs)", price: 9000 },
      { quantity: 25, label: "Party Pack (25 pcs)", price: 18500 },
    ],
    pricingNotes: "Freshly fried with whole seasoned boiled eggs wrapped in crisp golden crust.",
  },

  // 12. Other / Bespoke Orders
  other: {
    defaultMethod: "quote_only",
    suggestedUnitCost: 15000,
    suggestedTargetMargin: 0.50,
    suggestedBasePrice: 30000,
    unitLabel: "custom order",
    pricingNotes: "Bespoke quotation based on your custom requirements, portions, and theme.",
  },
};
