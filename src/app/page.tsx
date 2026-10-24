import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Users,
} from "lucide-react";
import { getPublishedProducts } from "@/lib/db";
import { BRAND } from "@/lib/constants";
import { buildGeneralChatLink } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import OccasionDiscovery from "@/components/OccasionDiscovery";
import FaqAccordion from "@/components/FaqAccordion";

export const revalidate = 60; // Incremental Static Regeneration

export const metadata: Metadata = {
  title: "Hamtunes Cakes & Bakes | Premium Cakes & Baked Goods",
  description:
    "Discover Hamtunes Cakes & Bakes, creating celebration cakes, personalised gifting cakes, pastries, and small chops. Explore our collection and enquire about your order.",
  alternates: {
    canonical: BRAND.siteUrl,
  },
  keywords: [
    "Hamtunes",
    "Hamtunes Cakes",
    "Hamtunes Cakes and Bakes",
    "Hamtunes Cakes & Bakes",
    "Hamtunes Bakery",
    "Hamtunes birthday cakes",
    "Hamtunes custom cakes",
    "Hamtunes cakes in Lagos",
    "Nigerian bakery",
    "Lagos cake vendor",
  ],
  openGraph: {
    title: "Hamtunes Cakes & Bakes | Premium Cakes & Baked Goods",
    description:
      "Discover Hamtunes Cakes & Bakes, creating celebration cakes, personalised gifting cakes, pastries, and small chops. Explore our collection and enquire about your order.",
    url: BRAND.siteUrl,
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Hamtunes Cakes & Bakes Official Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
};

export default function HomePage() {
  const products = getPublishedProducts();

  // Curated lists
  const cakeProducts = products.filter((p) => p.division === "cakes").slice(0, 4);
  const bakesProducts = products
    .filter((p) => p.division === "bakes_and_small_chops")
    .slice(0, 4);
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  const whatsAppUrl = buildGeneralChatLink();

  // Select a hero image from featured items
  const heroProduct = products.find((p) => p.is_featured) || products[0];
  const heroImageUrl = heroProduct ? heroProduct.primary_image_url : "/images/logo.png";

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9F5] via-[#FFFFFF] to-[#FFF9F5] pt-10 pb-16 lg:py-24 border-b border-[#E8DDD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Heritage Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] border border-[#F50057]/20 text-[#F50057] text-xs font-bold tracking-wide uppercase shadow-xs animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{BRAND.experienceYears} Years of Nigerian Baking Mastery</span>
              </div>

              {/* Suggested Headline */}
              <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#351207] tracking-tight leading-[1.15] animate-fade-in-up">
                Beautiful Cakes.{" "}
                <span className="text-[#F50057] underline decoration-[#F50057]/30 decoration-wavy decoration-2">
                  Delicious Bakes.
                </span>{" "}
                Made for Your Moments.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-[#6F625C] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal animate-fade-in-up stagger-1">
                From birthday cakes and thoughtful gifts to baked treats and authentic small chops,
                Hamtunes Cakes &amp; Bakes brings {BRAND.experienceYears} years of experience to the moments you want to celebrate.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-in-up stagger-2">
                <Link
                  href="/cakes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore Our Cakes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/bakes-and-small-chops"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F7EFE8] text-[#351207] font-semibold px-7 py-3.5 rounded-full border border-[#E8DDD7] hover:border-[#351207] shadow-xs transition-all"
                >
                  <span>Discover Our Bakes</span>
                </Link>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-5 py-3.5 rounded-full shadow-sm hover:shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 border-t border-[#E8DDD7]/70 text-left animate-fade-in stagger-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#F50057] shrink-0" />
                  <span className="text-xs font-semibold text-[#351207] leading-tight">
                    {BRAND.experienceYears} Years Proven Trust
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#F50057] shrink-0" />
                  <span className="text-xs font-semibold text-[#351207] leading-tight">
                    Freshly Baked To Order
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-[#F50057] shrink-0" />
                  <span className="text-xs font-semibold text-[#351207] leading-tight">
                    Custom Tailored Designs
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background framing */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-[#F50057]/20 to-[#351207]/10 rounded-3xl blur-lg -z-10" />

                <div className="relative aspect-square w-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-[#FFF9F5]">
                  <Image
                    src={heroImageUrl}
                    alt="Signature handcrafted celebration cake made by Hamtunes Cakes & Bakes"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8DDD7] shadow-lg flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#F50057]">
                        Handcrafted Perfection
                      </div>
                      <div className="text-sm font-serif font-bold text-[#351207]">
                        Fresh Celebration Masterpieces
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#351207] px-3 py-1 rounded-full bg-[#FFF0F5] border border-[#F50057]/20">
                      {BRAND.experienceYears} Yrs Craft
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OCCASION-BASED DISCOVERY */}
      <OccasionDiscovery />

      {/* 3. BUSINESS INTRODUCTION & BAKER PROFILE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#FFF9F5] rounded-3xl border border-[#E8DDD7] p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Owner Photograph */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-[#FFFFFF] shadow-xl bg-[#F7EFE8] group">
                <Image
                  src="/images/owner.jpg"
                  alt={`Founder and master baker at Hamtunes Cakes & Bakes with ${BRAND.experienceYears} years of culinary excellence`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-[#351207]/85 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-center">
                  <p className="text-xs font-semibold tracking-wide">
                    {BRAND.experienceYears} Years of Heartfelt Baking Craft
                  </p>
                </div>
              </div>
            </div>

            {/* Intro Content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
                  Our Story & Heritage
                </span>
                <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#351207]">
                  {BRAND.experienceYears} Years of Baking for Life&apos;s Special Moments
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#6F625C] leading-relaxed">
                <p>
                  Behind Hamtunes Cakes &amp; Bakes is a dedicated baker with {BRAND.experienceYears} years of experience creating
                  cakes and baked treats for diverse occasions. What started with a deep passion for the
                  craft has grown into a trusted destination for milestone birthdays, heartfelt gifts,
                  family gatherings, and festive celebrations.
                </p>
                <p>
                  Every cake is customized to your taste, theme, and occasion. At the same time, our fresh
                  doughnuts, cupcakes, meat pies, and authentic small chops bring warmth and flavor to any
                  event or tea break.
                </p>
              </div>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm text-[#351207] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#F50057] shrink-0" />
                  <span>Real authentic bakery photography</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#351207] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#F50057] shrink-0" />
                  <span>Equal focus on cakes and baked treats</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#351207] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#F50057] shrink-0" />
                  <span>Direct consultation with the baker</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#351207] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#F50057] shrink-0" />
                  <span>Catering for families, gifts, and events</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/enquire"
                  className="inline-flex items-center gap-2 bg-[#351207] hover:bg-[#220B04] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-all"
                >
                  <span>Start an Enquiry</span>
                  <ArrowRight className="w-4 h-4 text-[#F50057]" />
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#351207] hover:text-[#F50057] text-xs sm:text-sm font-semibold px-4 py-3 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#F50057]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DIVISION A: CAKES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
              Division A: Handcrafted Cakes
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207]">
              Cakes for Life&apos;s Milestones & Celebrations
            </h2>
            <p className="text-sm text-[#6F625C] max-w-xl">
              From colorful birthday cakes and character themes to thoughtful mini gifting cakes and
              traditional milestone centerpieces.
            </p>
          </div>
          <Link
            href="/cakes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F50057] hover:text-[#D5004C] transition-colors group"
          >
            <span>Explore All Cakes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Cake Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cakeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. DIVISION B: BAKES & SMALL CHOPS SECTION (EQUAL VISUAL WEIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
              Division B: Bakes & Small Chops
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207]">
              Fresh Bakes & Finger Foods for Every Gathering
            </h2>
            <p className="text-sm text-[#6F625C] max-w-xl">
              Fluffy glazed doughnuts, artisan cupcakes, golden flaky meat pies, spiced sausage
              rolls, and authentic Nigerian small chops prepared fresh for your moments.
            </p>
          </div>
          <Link
            href="/bakes-and-small-chops"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F50057] hover:text-[#D5004C] transition-colors group"
          >
            <span>Explore Bakes & Small Chops</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Bakes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bakesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. CURATED FEATURED GALLERY */}
      {featuredProducts.length > 0 && (
        <section className="bg-[#FFF9F5] py-16 border-y border-[#E8DDD7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
                Curated Collection
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207] mt-1.5">
                Featured Cakes & Bakes
              </h2>
              <p className="text-sm text-[#6F625C] mt-2">
                A balanced showcase of genuine customer favorites, celebration centerpieces, and
                delectable pastries crafted in our bakery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. EVENT ORDERS / EVENT PLANNERS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#351207] text-[#FFF9F5] rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#F50057]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A2718] text-[#F50057] text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Event Planners & Hosts</span>
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-white">
              Planning a Celebration? Let&apos;s Talk.
            </h2>

            <p className="text-sm sm:text-base text-[#F7EFE8]/80 leading-relaxed">
              Whether you are coordinating a wedding, milestone birthday, family introduction, or
              corporate gathering, Hamtunes Cakes & Bakes provides dependable catering for both
              statement cakes and savory party platters.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/event-planners"
                className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all"
              >
                <span>Discuss an Event Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5A2718] hover:bg-[#6F301F] text-white font-semibold px-5 py-3 rounded-full text-xs sm:text-sm border border-[#E8DDD7]/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#F50057]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. VERIFIED FAQS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
            Got Questions?
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207] mt-1.5">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#6F625C] mt-2">
            Clear, honest details on custom orders, gifting, pastries, and contact options.
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-b from-[#FFF9F5] to-[#FFFFFF] py-16 border-t border-[#E8DDD7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{BRAND.experienceYears} Years of Making Moments Sweet</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#351207]">
            Tell Us What You&apos;re Celebrating.
          </h2>

          <p className="text-base text-[#6F625C] max-w-xl mx-auto leading-relaxed">
            Whether you have a complete design in mind or need help exploring your options, start an
            enquiry with Hamtunes Cakes & Bakes today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/enquire"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold px-8 py-3.5 rounded-full shadow-md transition-all text-sm"
            >
              <span>Make an Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-7 py-3.5 rounded-full shadow-md transition-all text-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>Chat on WhatsApp (+234 803 397 6589)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
