"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Sparkles, ArrowRight, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { buildProductEnquiryLink } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const whatsappUrl = buildProductEnquiryLink(product.name, product.category);

  return (
    <div className="group bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden hover:border-[#F50057]/40 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Box */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F7EFE8]">
        <Image
          src={imageError ? "/images/logo.png" : product.primary_image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#351207]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[#351207] text-xs font-semibold hover:bg-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#F50057]" />
              <span>Quick View</span>
            </button>
          )}
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-lg text-[#351207] group-hover:text-[#F50057] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#6F625C] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
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
            <span>Enquire on WhatsApp</span>
          </a>

          <Link
            href={`/enquire?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`}
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#E8DDD7] text-[#351207] hover:bg-[#F7EFE8] hover:border-[#F50057] transition-colors"
            title="Online Enquiry Form"
            aria-label="Online Enquiry Form"
          >
            <ArrowRight className="w-4 h-4 text-[#F50057]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
