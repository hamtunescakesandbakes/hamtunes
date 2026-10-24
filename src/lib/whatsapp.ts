import { BRAND } from "./constants";
import { Enquiry } from "./types";

/**
 * Builds a direct, encoded WhatsApp click-to-chat URL with a prefilled message.
 * User must manually press send in WhatsApp.
 */
export function buildWhatsAppLink(message: string, customPhone?: string): string {
  const phone = (customPhone || BRAND.whatsAppNumber).replace(/\D/g, "");
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Generates an enquiry message tailored to customer input
 */
export function generateWhatsAppEnquiryMessage(enquiry: Partial<Enquiry>): string {
  const parts: string[] = [];

  parts.push(`👋 Hello Hamtunes Cakes & Bakes!`);
  parts.push(``);

  if (enquiry.customer_name) {
    parts.push(`*Name:* ${enquiry.customer_name}`);
  }
  if (enquiry.phone_number) {
    parts.push(`*Phone:* ${enquiry.phone_number}`);
  }
  if (enquiry.business_name) {
    parts.push(`*Business / Brand:* ${enquiry.business_name}`);
  }

  // Type & categories
  const typeMap: Record<string, string> = {
    general: "General Enquiry",
    cake: "Custom Cake Enquiry",
    gifting_cake: "Gifting / Mini Cake Enquiry",
    bakes_and_small_chops: "Bakes & Small Chops Order",
    event: "Event & Party Catering",
    event_planner: "Event Planner Partnership",
    other: "Bespoke / Custom Order",
  };

  if (enquiry.enquiry_type) {
    parts.push(`*Enquiry Type:* ${typeMap[enquiry.enquiry_type] || enquiry.enquiry_type}`);
  }

  if (enquiry.product_categories && enquiry.product_categories.length > 0) {
    parts.push(`*Categories:* ${enquiry.product_categories.join(", ")}`);
  }

  if (enquiry.products_interested) {
    parts.push(`*Item of Interest:* ${enquiry.products_interested}`);
  }

  if (enquiry.event_date) {
    parts.push(`*Required Date / Event Date:* ${enquiry.event_date}`);
  }

  if (enquiry.cake_size_or_quantity) {
    parts.push(`*Size / Quantity:* ${enquiry.cake_size_or_quantity}`);
  }

  if (enquiry.collection_or_delivery && enquiry.collection_or_delivery !== "undecided") {
    parts.push(`*Preference:* ${enquiry.collection_or_delivery === "delivery" ? "Delivery" : "Pickup / Collection"}`);
  }

  if (enquiry.budget_range) {
    parts.push(`*Estimated Budget:* ${enquiry.budget_range}`);
  }

  if (enquiry.design_notes) {
    parts.push(``);
    parts.push(`*Details / Custom Request:*`);
    parts.push(enquiry.design_notes);
  }

  parts.push(``);
  parts.push(`I submitted this request on your website and would love to confirm availability and discuss further.`);

  return parts.join("\n");
}

/**
 * Quick product enquiry link
 */
export function buildProductEnquiryLink(productName: string, category: string): string {
  const message = `👋 Hello Hamtunes Cakes & Bakes!\n\nI was browsing your website and I'm interested in enquiring about:\n*${productName}* (${category}).\n\nPlease let me know your current availability and options for ordering. Thank you!`;
  return buildWhatsAppLink(message);
}

/**
 * Quick general chat link
 */
export function buildGeneralChatLink(): string {
  const message = `👋 Hello Hamtunes Cakes & Bakes! I would like to make an enquiry about your cakes and baked goods.`;
  return buildWhatsAppLink(message);
}

/**
 * Event planner chat link
 */
export function buildEventPlannerChatLink(): string {
  const message = `👋 Hello Hamtunes Cakes & Bakes! I am an event planner and would love to discuss sourcing cakes, pastries, and small chops for upcoming client events.`;
  return buildWhatsAppLink(message);
}
