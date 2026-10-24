import { Division } from "../types";
import { BRAND } from "../constants";

export interface ClassificationResult {
  division: Division;
  suggested_category: string;
  confidence_score: number;
  caption: string;
  alt_text: string;
  is_brand_asset: boolean;
  notes: string;
}

export function classifyImage(filename: string, folderName: string): ClassificationResult {
  const cleanName = filename.replace(/\.[^/.]+$/, ""); // strip extension
  const lowerName = cleanName.toLowerCase();
  const lowerFolder = folderName.toLowerCase();

  // 1. BRAND IDENTITY
  if (lowerFolder.includes("brand identity") || lowerName.includes("logo")) {
    return {
      division: "brand",
      suggested_category: "brand_logo",
      confidence_score: 0.99,
      caption: "Hamtunes Cakes & Bakes Official Logo",
      alt_text: "Official logo of Hamtunes Cakes & Bakes featuring signature pink and chocolate brown tones",
      is_brand_asset: true,
      notes: "Detected as official brand identity asset. Excluded from public product galleries.",
    };
  }

  // 2. BRAND PHOTOGRAPHY (Owner / Baker)
  if (lowerFolder.includes("brand photography") || lowerName.includes("owner") || lowerName.includes("baker")) {
    return {
      division: "brand",
      suggested_category: "owner_portrait",
      confidence_score: 0.99,
      caption: "The Baker & Founder of Hamtunes Cakes & Bakes",
      alt_text: `The experienced baker and founder behind Hamtunes Cakes & Bakes with ${BRAND.experienceYears} of craft`,
      is_brand_asset: true,
      notes: "Detected as founder/baker brand photography. Displayed in introduction & about sections, not product catalogue.",
    };
  }

  // 3. CAKE DETECTION (Keyword override or Cakes folder)
  const isCakeKeyword =
    lowerName.includes("cake") ||
    lowerName.includes("birthday") ||
    lowerName.includes("wedding") ||
    lowerName.includes("anniversary") ||
    lowerName.includes("graduation") ||
    lowerName.includes("sheet cake");

  if (lowerFolder.includes("cakes") || isCakeKeyword) {
    // Sub-classify cake
    let category = "birthday_cakes";
    let confidence = 0.92;
    let caption = cleanName;
    let alt = `Custom handcrafted cake by Hamtunes Cakes & Bakes: ${cleanName}`;

    if (
      lowerName.includes("wedding") ||
      lowerName.includes("anniversary") ||
      lowerName.includes("two-tier") ||
      lowerName.includes("floral")
    ) {
      category = "custom_cakes";
      alt = `Elegant celebration cake for weddings and milestones by Hamtunes Cakes & Bakes: ${cleanName}`;
    } else if (
      lowerName.includes("favor") ||
      lowerName.includes("tomiwa") ||
      lowerName.includes("money") ||
      lowerName.includes("gift") ||
      lowerName.includes("butterfly")
    ) {
      category = "gifting_cakes";
      alt = `Thoughtful gifting and personalized mini cake by Hamtunes Cakes & Bakes: ${cleanName}`;
    } else if (
      lowerName.includes("cultural") ||
      lowerName.includes("traditional") ||
      lowerName.includes("aso-ebi")
    ) {
      category = "cultural_cakes";
      alt = `Cultural celebration cake crafted with elegance by Hamtunes Cakes & Bakes: ${cleanName}`;
    } else if (lowerName.includes("birthday") || lowerName.includes("50th") || lowerName.includes("5th") || lowerName.includes("10th") || lowerName.includes("minion") || lowerName.includes("bratz") || lowerName.includes("unicorn")) {
      category = "birthday_cakes";
      alt = `Custom birthday celebration cake by Hamtunes Cakes & Bakes: ${cleanName}`;
    } else {
      category = "custom_cakes";
      confidence = 0.82;
    }

    // If a cake was placed inside the desserts folder, note it
    const notes = lowerFolder.includes("deserts")
      ? "Cake detected inside Deserts/Baked goods folder. Properly routed to Cakes division."
      : "High confidence cake classification.";

    return {
      division: "cakes",
      suggested_category: category,
      confidence_score: confidence,
      caption,
      alt_text: alt,
      is_brand_asset: false,
      notes,
    };
  }

  // 4. BAKES & SMALL CHOPS
  let bakesCategory = "baked_goods";
  let confidence = 0.90;
  let caption = cleanName;
  let alt = `Fresh baked treats and savory finger foods by Hamtunes Cakes & Bakes: ${cleanName}`;

  if (lowerName.includes("donut") || lowerName.includes("doughnut")) {
    bakesCategory = "doughnuts";
    caption = cleanName.includes("Pile") ? "Sugar-Dusted Jelly-Filled Doughnuts" : "Rainbow Sprinkle Glazed Doughnuts";
    alt = "Fresh, fluffy golden doughnuts by Hamtunes Cakes & Bakes";
  } else if (lowerName.includes("cupcake")) {
    bakesCategory = "cupcakes";
    caption = "Pastel Fondant Artisan Cupcakes";
    alt = "Artisan bakery box of decorated cupcakes with buttercream and fondant toppers by Hamtunes";
  } else if (lowerName.includes("pie") || lowerName.includes("empanada")) {
    bakesCategory = "meat_pies";
    caption = "Golden Hand Pies & Savory Meat Pies";
    alt = "Flaky golden meat pies and Caribbean hand pies packed with seasoned beef by Hamtunes";
  } else if (lowerName.includes("sausage roll")) {
    bakesCategory = "sausage_rolls";
    caption = "Golden Crisp Sausage Rolls";
    alt = "Freshly baked golden sausage rolls with seasoned savory filling by Hamtunes";
  } else if (
    lowerName.includes("egg roll") ||
    lowerName.includes("eggroll") ||
    lowerName.includes("fried dough")
  ) {
    bakesCategory = "egg_rolls";
    caption = "Fresh Golden Nigerian Egg Rolls";
    alt = "Fresh golden Nigerian egg rolls handcrafted by Hamtunes Cakes & Bakes";
  } else if (
    lowerName.includes("snack") ||
    lowerName.includes("fried dough") ||
    lowerName.includes("puff") ||
    lowerName.includes("shortbread") ||
    lowerName.includes("cookies") ||
    lowerName.includes("treats") ||
    lowerName.includes("loaf")
  ) {
    bakesCategory = "small_chops";
    caption = cleanName;
    alt = `Delicious Nigerian party treats and bakes by Hamtunes Cakes & Bakes: ${cleanName}`;
  } else if (lowerName.includes("chicken") || lowerName.includes("fish")) {
    bakesCategory = "party_bulk";
    caption = cleanName;
    alt = `Savory party catering and seasoned event dishes by Hamtunes Cakes & Bakes: ${cleanName}`;
  } else {
    confidence = 0.70;
  }

  return {
    division: "bakes_and_small_chops",
    suggested_category: bakesCategory,
    confidence_score: confidence,
    caption,
    alt_text: alt,
    is_brand_asset: false,
    notes: "Categorized under Bakes & Small Chops division.",
  };
}
