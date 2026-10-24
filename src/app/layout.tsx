import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import { BRAND } from "@/lib/constants";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: "Hamtunes Cakes & Bakes | Premium Cakes & Baked Goods",
    template: "%s | Hamtunes Cakes & Bakes",
  },
  description:
    "Discover Hamtunes Cakes & Bakes, creating celebration cakes, personalised gifting cakes, pastries, and small chops. Explore our collection and enquire about your order.",
  keywords: [
    "Hamtunes",
    "Hamtunes Cakes",
    "Hamtunes Cakes and Bakes",
    "Hamtunes Cakes & Bakes",
    "Hamtunes Bakery",
    "Hamtunes birthday cakes",
    "Hamtunes custom cakes",
    "Hamtunes cakes in Lagos",
    "Birthday cakes Nigeria",
    "Cakes for gifting",
    "Custom celebration cakes",
    "Hamtunes baked goods",
    "Doughnuts",
    "Cupcakes",
    "Meat pies",
    "Egg rolls",
    "Sausage rolls",
    "Small chops",
    "Lagos bakery and confectionery",
  ],
  authors: [{ name: "Hamtunes Cakes & Bakes" }],
  creator: "Hamtunes Cakes & Bakes",
  publisher: "Hamtunes Cakes & Bakes",
  alternates: {
    canonical: BRAND.siteUrl,
  },
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
  twitter: {
    card: "summary_large_image",
    title: "Hamtunes Cakes & Bakes | Premium Cakes & Baked Goods",
    description:
      "Discover Hamtunes Cakes & Bakes, creating celebration cakes, personalised gifting cakes, pastries, and small chops. Explore our collection and enquire about your order.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness", "Organization"],
    name: BRAND.name,
    legalName: BRAND.legalName,
    alternateName: [
      "Hamtunes",
      "Hamtunes Cakes",
      "Hamtunes Cakes and Bakes",
      "Hamtunes Bakery",
      "Hamtunes Lagos",
    ],
    description:
      `Discover Hamtunes Cakes & Bakes, creating celebration cakes, personalised gifting cakes, pastries, and small chops with ${BRAND.experienceYears} years of Nigerian baking mastery.`,
    url: BRAND.siteUrl,
    logo: `${BRAND.siteUrl}/images/logo.png`,
    image: [
      `${BRAND.siteUrl}/images/logo.png`,
      `${BRAND.siteUrl}/images/owner.jpg`,
    ],
    telephone: BRAND.phoneDisplay,
    email: BRAND.email,
    sameAs: [BRAND.instagramUrl],
    priceRange: "₦₦",
    servesCuisine: [
      "Bakery",
      "Celebration Cakes",
      "Confectionery",
      "Nigerian Small Chops",
      "Pastries",
    ],
    areaServed: [
      {
        "@type": "City",
        name: "Lagos",
      },
      {
        "@type": "Country",
        name: "Nigeria",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hamtunes Products & Catering Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Celebration & Custom Cakes",
        },
        {
          "@type": "OfferCatalog",
          name: "Gifting & Mini Cakes",
        },
        {
          "@type": "OfferCatalog",
          name: "Fresh Pastries & Doughnuts",
        },
        {
          "@type": "OfferCatalog",
          name: "Savory Small Chops & Event Platters",
        },
      ],
    },
  };

  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FFFFFF] text-[#351207] antialiased selection:bg-[#FFF0F5] selection:text-[#F50057]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
