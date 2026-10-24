"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Package,
} from "lucide-react";
import { BAKES_CATEGORIES } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import { Product } from "@/lib/types";

export default function BakesAndSmallChopsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    fetch("/api/products?division=bakes_and_small_chops")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching bakes:", err))
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

  const bulkOrderWhatsApp = buildWhatsAppLink(
    "👋 Hello Hamtunes Cakes & Bakes! I would like to enquire about a party platter / bulk order of pastries and small chops."
  );

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO (Equal prominence with Cakes!) */}
      <section className="bg-gradient-to-b from-[#FFF9F5] to-[#FFFFFF] py-16 border-b border-[#E8DDD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Division B: Artisan Pastries & Finger Foods</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#351207]">
            Delicious Bakes & Small Chops for Every Occasion
          </h1>

          <p className="text-base sm:text-lg text-[#6F625C] max-w-2xl mx-auto leading-relaxed">
            From golden meat pies and crisp sausage rolls to freshly glazed doughnuts and authentic
            Nigerian small chops, our bakes are handcrafted fresh daily.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/enquire?type=bakes_and_small_chops"
              className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all"
            >
              <span>Order Pastries & Small Chops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={bulkOrderWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F7EFE8] text-[#351207] border border-[#E8DDD7] text-xs sm:text-sm font-semibold px-5 py-3 rounded-full shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#F50057]" />
              <span>Bulk Order WhatsApp Chat</span>
            </a>
          </div>

          {/* Pricing Transparency Pill */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-[#E8DDD7] text-xs text-[#6F625C] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <span className="font-bold text-[#351207] block">Bakes & Small Chops Pricing:</span>
                Savory meat pies from ₦1,500/pc, golden sausage rolls from ₦1,200/pc, artisan doughnuts and cupcakes from ₦7,000/box, and party small chops platters from ₦18,000 (Midi) to ₦60,000 (Grand).
              </div>
              <Link
                href="/enquire?type=bakes_and_small_chops"
                className="shrink-0 text-[#F50057] font-semibold hover:underline"
              >
                Order Platter &rarr;
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
                placeholder="Search bakes (e.g., Doughnuts, Sausage rolls, Meat pies)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057] focus:ring-1 focus:ring-[#F50057]"
              />
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-[#6F625C] font-medium self-end md:self-center">
              Showing <span className="font-bold text-[#351207]">{filteredProducts.length}</span>{" "}
              savory & sweet bakes
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-[#6F625C] flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {BAKES_CATEGORIES.map((cat) => {
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
            <p className="text-sm text-[#6F625C]">Loading our freshly baked treats & small chops...</p>
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
              Need a custom bulk pack of small chops, specific pastry counts, or party gift trays?
              Contact our baker directly to fulfill your order!
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
                href="/enquire?type=bakes_and_small_chops"
                className="text-xs font-semibold px-5 py-2.5 rounded-full bg-[#F50057] text-white shadow-sm"
              >
                Order Bakes & Small Chops
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. PARTY AND BULK ORDERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF9F5] rounded-3xl border border-[#E8DDD7] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" />
                <span>Bulk Trays & Event Platters</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207]">
                Planning a Party or Event? Order Small Chops in Bulk.
              </h2>
              <p className="text-sm text-[#6F625C] leading-relaxed">
                Whether you need 50 pieces or 500+ packs for a birthday, wedding reception, corporate
                training, or family thanksgiving, Hamtunes Cakes & Bakes supplies fresh, piping-hot
                finger foods, snack jars, and pastries packaged with presentation excellence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-[#351207] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F50057]" />
                  <span>Customizable assorted snack boxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F50057]" />
                  <span>Piping hot preparation on event morning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F50057]" />
                  <span>Reliable venue drop-off or pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#F50057]" />
                  <span>Combine cakes and small chops together</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-4 shadow-sm text-center">
              <h3 className="font-serif font-bold text-lg text-[#351207]">
                Ready to Order for Your Guests?
              </h3>
              <p className="text-xs text-[#6F625C]">
                Tell us your guest estimate, event date, and favorite treats to receive our tailored
                quote.
              </p>
              <Link
                href="/enquire?type=bakes_and_small_chops"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold py-3 rounded-xl shadow-sm transition-all"
              >
                <span>Bulk Order Request Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={bulkOrderWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                <span>Instant WhatsApp Quote</span>
              </a>
            </div>
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
