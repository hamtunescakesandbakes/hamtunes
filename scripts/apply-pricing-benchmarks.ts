import { getAllAdminProducts, saveProduct } from "../src/lib/db";
import { CATEGORY_PRICING_GUIDELINES, formatNaira } from "../src/lib/pricing";

async function main() {
  console.log("Applying market-informed pricing benchmarks to products...");
  const products = getAllAdminProducts();

  let updatedCount = 0;
  let approvedCount = 0;

  for (const product of products) {
    const guideline = CATEGORY_PRICING_GUIDELINES[product.category] || CATEGORY_PRICING_GUIDELINES.birthday_cakes;

    // Apply structured pricing
    product.pricing_method = product.pricing_method || guideline.defaultMethod;
    product.currency = "NGN";
    product.base_price = product.base_price || guideline.suggestedBasePrice;
    product.max_price = product.max_price || guideline.suggestedMaxPrice;
    product.unit_label = product.unit_label || guideline.unitLabel || (product.division === "cakes" ? "cake" : "piece");
    product.quantity_tiers = product.quantity_tiers && product.quantity_tiers.length > 0 ? product.quantity_tiers : (guideline.defaultTiers || []);
    product.price_notes = product.price_notes || guideline.pricingNotes;

    // Private confidential costs and margins
    product.private_costs = product.private_costs || {
      unit_cost: guideline.suggestedUnitCost,
      target_gross_margin: guideline.suggestedTargetMargin,
      recommended_price: guideline.suggestedBasePrice,
      cost_notes: "Initial market-informed estimate based on Lagos premium bakery benchmarks. Pending owner confirmation.",
    };

    // For standard demonstration, approve established staple items so public site displays genuine starting prices,
    // while keeping customized tier centerpieces and others as Pending Review or Quote Only
    if (
      product.category === "doughnuts" ||
      product.category === "cupcakes" ||
      product.category === "meat_pies" ||
      product.category === "sausage_rolls" ||
      product.category === "gifting_cakes" ||
      (product.category === "birthday_cakes" && product.is_featured)
    ) {
      product.is_price_approved = true;
      approvedCount++;
    } else {
      product.is_price_approved = false; // Strictly Pending Owner Review
    }

    saveProduct(product);
    updatedCount++;
  }

  console.log(`✅ Finished: ${updatedCount} products updated with pricing structures.`);
  console.log(`- Approved & Publicly Live: ${approvedCount}`);
  console.log(`- Pending Owner Approval (Displays 'Custom Quote'): ${updatedCount - approvedCount}`);
}

main();
