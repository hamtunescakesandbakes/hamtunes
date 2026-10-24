"use client";

import React from "react";
import Image from "next/image";
import { X, MessageCircle, Tag, Info, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getProductDisplayPrice, formatNaira } from "@/lib/pricing";

interface ImageGalleryModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ImageGalleryModal({ product, onClose }: ImageGalleryModalProps) {
  if (!product) return null;

  const displayPrice = product.price_display || getProductDisplayPrice(product);
  const isCustomQuote =
    !product.is_price_approved ||
    product.pricing_method === "quote_only" ||
    displayPrice.includes("Quote") ||
    displayPrice.includes("Consultation");

  const whatsappMsg = `👋 Hello Hamtunes Cakes & Bakes!\n\nI was looking at *${product.name}* (${product.category.replace(/_/g, " ")}) on your website.\n${!isCustomQuote ? `*Pricing Reference:* ${displayPrice}\n` : ""}I would like to discuss sizing, flavors, and availability for my event.`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#351207]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DDD7] animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD7] shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F50057]">
              {product.category.replace(/_/g, " ")}
            </span>
            <h3 className="font-serif font-bold text-lg text-[#351207]">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F7EFE8] text-[#351207] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Big Preview Image */}
          <div className="relative aspect-video max-h-[380px] w-full bg-[#F7EFE8] rounded-2xl overflow-hidden border border-[#E8DDD7]">
            <Image
              src={product.primary_image_url}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Pricing Details Block */}
          <div className="bg-[#FFF9F5] p-5 rounded-2xl border border-[#E8DDD7] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F625C] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#F50057]" />
                <span>Pricing Overview</span>
              </span>
              <span className="text-base font-serif font-black text-[#F50057]">
                {displayPrice}
              </span>
            </div>

            {/* Quantity Tiers if available and approved */}
            {product.is_price_approved && product.quantity_tiers && product.quantity_tiers.length > 0 && (
              <div className="pt-2 border-t border-[#E8DDD7]/70 space-y-1.5">
                <span className="text-[11px] font-bold text-[#351207]">Available Quantity Options:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.quantity_tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#E8DDD7] text-center space-y-0.5"
                    >
                      <div className="text-[11px] font-semibold text-[#6F625C]">{tier.label}</div>
                      <div className="text-xs font-bold text-[#351207]">{formatNaira(tier.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Transparency Note */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-[#6F625C] leading-relaxed">
              <Info className="w-3.5 h-3.5 text-[#F50057] shrink-0 mt-0.5" />
              <span>
                {product.division === "cakes"
                  ? "Final quote depends on confirmed cake size, tier structure, custom artwork, and delivery venue. Savor freshly baked goodness crafted with 16 years of expertise."
                  : "Baked treats are prepared fresh daily. Bulk discounts and custom party platter packaging available upon consultation."}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#6F625C] leading-relaxed">
            {product.description}
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs font-semibold text-[#351207]">
              16 Years of Nigerian Baking Mastery
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#F50057]" />
              <span>{isCustomQuote ? "Request Custom Quotation" : "Enquire on WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
