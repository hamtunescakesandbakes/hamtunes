import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  ChevronRight,
  Tag,
  Share2,
} from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/lib/db";
import { BRAND } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { getProductDisplayPrice } from "@/lib/pricing";
import ProductCard from "@/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Hamtunes Cakes & Bakes",
      robots: { index: false, follow: false },
    };
  }

  const displayPrice = product.price_display || getProductDisplayPrice(product);
  const title = `${product.name} | Hamtunes Cakes & Bakes`;
  const description = `${product.name} handcrafted by Hamtunes Cakes & Bakes with ${BRAND.experienceYears} years of Nigerian baking mastery. ${displayPrice}. Available for custom orders and events in Lagos.`;
  const canonicalUrl = `${BRAND.siteUrl}/products/${product.slug}`;
  const imageUrl = product.primary_image_url.startsWith("http")
    ? product.primary_image_url
    : `${BRAND.siteUrl}${product.primary_image_url}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Hamtunes Cakes & Bakes",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: `${product.name} handcrafted by Hamtunes Cakes & Bakes`,
        },
      ],
      locale: "en_NG",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getAllProducts();
  const displayPrice = product.price_display || getProductDisplayPrice(product);
  const isCake = product.division === "cakes";
  const parentUrl = isCake ? "/cakes" : "/bakes-and-small-chops";
  const parentLabel = isCake ? "Cakes" : "Bakes & Small Chops";

  // Related products from same category or division
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  // Prefilled WhatsApp order message
  const whatsappMsg = `👋 Hello Hamtunes Cakes & Bakes!\n\nI am interested in ordering/enquiring about:\n*${product.name}*\nCategory: ${product.category.replace(/_/g, " ")}\nPricing Reference: ${displayPrice}\nLink: ${BRAND.siteUrl}/products/${product.slug}\n\nPlease let me know availability and design options for my event date. Thank you!`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  // JSON-LD Structured Data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.primary_image_url.startsWith("http")
      ? product.primary_image_url
      : `${BRAND.siteUrl}${product.primary_image_url}`,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Hamtunes Cakes & Bakes",
    },
    offers: {
      "@type": "Offer",
      url: `${BRAND.siteUrl}/products/${product.slug}`,
      priceCurrency: "NGN",
      price: product.base_price || 0,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BRAND.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: parentLabel,
        item: `${BRAND.siteUrl}${parentUrl}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${BRAND.siteUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#6F625C]">
          <Link href="/" className="hover:text-[#F50057] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#E8DDD7]" />
          <Link href={parentUrl} className="hover:text-[#F50057] transition-colors">
            {parentLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#E8DDD7]" />
          <span className="text-[#351207] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: High Resolution Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E8DDD7] bg-[#FFF9F5] shadow-lg">
              <Image
                src={product.primary_image_url}
                alt={`${product.name} handcrafted by Hamtunes Cakes & Bakes`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {product.is_featured && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F50057] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Masterpiece</span>
                </div>
              )}
            </div>

            {/* Visual caption */}
            <p className="text-xs text-[#6F625C] text-center italic">
              Actual photograph of {product.name} prepared by Hamtunes Cakes & Bakes.
            </p>
          </div>

          {/* Right Column: Product Details & Conversion Hub */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] border border-[#F50057]/20 text-[#F50057] text-xs font-bold uppercase tracking-wider">
                <span>{product.category.replace(/_/g, " ")}</span>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#351207] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF9F5] border border-[#E8DDD7]">
                  <Tag className="w-4 h-4 text-[#F50057]" />
                  <span className="font-bold text-xl text-[#351207]">{displayPrice}</span>
                </div>
                {product.pricing_method === "starting_at" && (
                  <span className="text-xs text-[#6F625C]">Base size starting price</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-[#6F625C] leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Occasion / Serving Guide */}
            <div className="p-4 rounded-2xl bg-[#F7EFE8]/70 border border-[#E8DDD7] space-y-2 text-xs text-[#351207]">
              <div className="font-bold flex items-center gap-1.5 text-[#351207]">
                <Clock className="w-3.5 h-3.5 text-[#F50057]" />
                <span>Order Lead Time & Customisation</span>
              </div>
              <p className="text-[#6F625C]">
                Each item is freshly baked from scratch with premium ingredients. Custom celebration cakes
                recommend 3–5 days notice. Urgent dates can often be accommodated on request.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Enquire via WhatsApp</span>
              </a>

              <Link
                href={`/enquire?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}&price=${encodeURIComponent(displayPrice)}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white font-bold px-6 py-3.5 rounded-2xl shadow-sm transition-all text-sm"
              >
                <span>Complete Online Enquiry Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-4 border-t border-[#E8DDD7] grid grid-cols-2 gap-3 text-xs text-[#351207]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F50057] shrink-0" />
                <span className="font-semibold">{BRAND.experienceYears} Baking Trust</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#F50057] shrink-0" />
                <span className="font-semibold">Lagos Delivery Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-[#E8DDD7] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
                  More from {parentLabel}
                </span>
                <h2 className="font-serif font-black text-2xl text-[#351207]">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={parentUrl}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F50057] hover:underline"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
