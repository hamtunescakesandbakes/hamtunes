"use client";

import React from "react";
import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { buildProductEnquiryLink } from "@/lib/whatsapp";

interface ImageGalleryModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ImageGalleryModal({ product, onClose }: ImageGalleryModalProps) {
  if (!product) return null;

  const whatsappUrl = buildProductEnquiryLink(product.name, product.category);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#351207]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DDD7] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD7]">
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

        {/* Big Preview Image */}
        <div className="relative aspect-square max-h-[460px] w-full bg-[#F7EFE8]">
          <Image
            src={product.primary_image_url}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Footer info & CTA */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-[#6F625C] leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs font-semibold text-[#351207]">
              16 Years of Custom Baking Excellence
            </span>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#F50057]" />
              <span>Enquire About This on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
