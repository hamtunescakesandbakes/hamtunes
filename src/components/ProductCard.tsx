"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, ArrowRight, Eye, Tag } from "lucide-react";
import { Product } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getProductDisplayPrice } from "@/lib/pricing";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const displayPrice = product.price_display || getProductDisplayPrice(product);
  const isCustomQuote =
    !product.is_price_approved ||
    product.pricing_method === "quote_only" ||
    displayPrice.includes("Quote") ||
    displayPrice.includes("Consultation");

  // Custom prefilled WhatsApp message with pricing context
  const whatsappMsg = `👋 Hello Hamtunes Cakes & Bakes!\n\nI was browsing your website and I'm interested in enquiring about:\n*${product.name}* (${product.category.replace(/_/g, " ")})\n${!isCustomQuote ? `*Pricing Reference:* ${displayPrice}\n` : ""}Please let me know availability and options for ordering. Thank you!`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  return (
    <div className="group bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden hover:border-[#F50057]/40 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F7EFE8]">
        <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
          <Image
            src={imageError ? "/images/logo.png" : product.primary_image_url}
            alt={`${product.name} handcrafted by Hamtunes Cakes & Bakes`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#351207]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[#351207] text-xs font-semibold hover:bg-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#F50057]" />
              <span>Quick View</span>
            </button>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F50057] text-white text-xs font-semibold hover:bg-[#D5004C] transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F50057] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#351207]/80 backdrop-blur-sm text-white text-[11px] font-medium capitalize">
            {product.category.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              <h3 className="font-serif font-bold text-lg text-[#351207] group-hover:text-[#F50057] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-[#6F625C] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Highlight Pill */}
          <div className="pt-1 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFF9F5] border border-[#E8DDD7]">
              <Tag className="w-3 h-3 text-[#F50057]" />
              <span className={`text-xs font-bold ${isCustomQuote ? "text-[#6F625C]" : "text-[#351207]"}`}>
                {displayPrice}
              </span>
            </div>
            {product.is_price_approved && product.pricing_method === "starting_at" && (
              <span className="text-[10px] text-[#6F625C] italic">Base size</span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#E8DDD7]/70 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-sm transition-all"
            title={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-[#F50057]" />
            <span>{isCustomQuote ? "Request a Quote" : "Enquire / Order"}</span>
          </a>

          <Link
            href={`/enquire?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}&price=${encodeURIComponent(displayPrice)}`}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#E8DDD7] text-[#351207] hover:bg-[#F7EFE8] hover:border-[#F50057] transition-colors"
            title="Custom Order Consultation Form"
            aria-label="Custom Order Consultation Form"
          >
            <ArrowRight className="w-4 h-4 text-[#F50057]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
