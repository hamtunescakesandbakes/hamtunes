"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { CAKE_CATEGORIES } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import { Product } from "@/lib/types";

// Client-side interactive catalog with initial products fetched from API or embedded
export default function CakesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    fetch("/api/products?division=cakes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching cakes:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const customCakeWhatsApp = buildWhatsAppLink(
    "👋 Hello Hamtunes Cakes & Bakes! I have a custom cake idea in mind and would love to discuss design options and availability."
  );

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO */}
      <section className="bg-gradient-to-b from-[#FFF9F5] to-[#FFFFFF] py-16 border-b border-[#E8DDD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Division A: Handcrafted Celebration Cakes</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#351207]">
            Cakes for Every Celebration
          </h1>

          <p className="text-base sm:text-lg text-[#6F625C] max-w-2xl mx-auto leading-relaxed">
            Explore birthday cakes, thoughtful gifting cakes, cultural celebration cakes, and
            custom cakes for occasions worth remembering.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/enquire?type=cake"
              className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all"
            >
              <span>Custom Cake Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={customCakeWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F7EFE8] text-[#351207] border border-[#E8DDD7] text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#F50057]" />
              <span>Discuss Custom Design</span>
            </a>
          </div>

          {/* Pricing Transparency Pill */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#E8DDD7] text-xs text-[#6F625C] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="font-bold text-[#351207] block">Transparent Cake Pricing:</span>
                Single-tier celebration cakes start from ₦35,000, personalized gifting cakes start from ₦13,000, and multi-tier / structural centerpieces are custom quoted based on your guest count and design.
              </div>
              <Link
                href="/enquire?type=cake"
                className="shrink-0 text-[#F50057] font-semibold hover:underline"
              >
                Get Custom Quote &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] p-4 sm:p-6 rounded-2xl border border-[#E8DDD7] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F625C]" />
              <input
                type="text"
                placeholder="Search cakes (e.g., Birthday, 50th, Gold)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057] focus:ring-1 focus:ring-[#F50057]"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-[#6F625C] font-medium self-end md:self-center">
              Showing <span className="font-bold text-[#351207]">{filteredProducts.length}</span>{" "}
              handcrafted creations
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-[#6F625C] flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {CAKE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#F50057] text-white shadow-sm"
                      : "bg-[#F7EFE8] text-[#351207] hover:bg-[#E8DDD7]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-[#F50057] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#6F625C]">Loading our handcrafted cake portfolio...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-[#FFF9F5] border border-dashed border-[#E8DDD7] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
            <HelpCircle className="w-12 h-12 text-[#F50057] mx-auto" />
            <h3 className="font-serif font-bold text-xl text-[#351207]">
              No exact match for &quot;{searchQuery}&quot;
            </h3>
            <p className="text-sm text-[#6F625C]">
              We craft fully customized cakes for themes and designs not yet pictured. Describe your
              idea or send us a reference photo directly!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs font-semibold px-5 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E8DDD7] text-[#351207]"
              >
                Clear Filters
              </button>
              <Link
                href="/enquire?type=cake"
                className="text-xs font-semibold px-5 py-2.5 rounded-full bg-[#F50057] text-white shadow-sm"
              >
                Make a Custom Cake Enquiry
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. CUSTOM CAKE DESIGN BANNER (When customer has a photo or unlisted style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#351207] text-[#FFF9F5] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
              Custom Designs Welcome
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              Have a Specific Design or Reference Photo in Mind?
            </h2>
            <p className="text-sm text-[#F7EFE8]/80 leading-relaxed">
              Wedding cakes, engagement tiers, milestone anniversaries, and intricate cartoon themes
              can all be created according to your exact specifications. Even if your preferred style
              isn&apos;t shown above, our 16-year seasoned baker can bring your vision to life.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/enquire?type=cake"
                className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all"
              >
                <span>Upload Reference & Enquire</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={customCakeWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5A2718] hover:bg-[#6F301F] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full border border-[#E8DDD7]/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#F50057]" />
                <span>Send Reference via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CAKE ORDERING PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
            Simple & Transparent
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207] mt-1.5">
            How Custom Cake Ordering Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#F50057] font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-[#351207]">Choose or Describe</h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Select a cake from our portfolio, or tell us your preferred occasion, theme, and color palette.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#F50057] font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-[#351207]">Confirm Details</h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Confirm your required date, number of tiers/size, flavors, personalized inscriptions, and delivery location.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#F50057] font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-[#351207]">Freshly Baked</h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Your cake is handcrafted and freshly baked with 16 years of expertise to ensure unmatched taste and presentation.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0F5] text-[#F50057] font-bold flex items-center justify-center text-sm">
              04
            </div>
            <h3 className="font-serif font-bold text-base text-[#351207]">Pickup or Delivery</h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Receive your cake punctually on your special day, ready to delight your celebrant and guests.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageGalleryModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
