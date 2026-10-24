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
  metadataBase: new URL("https://hamtunescakes.com"),
  title: "Hamtunes Cakes & Bakes | Handcrafted Cakes, Pastries & Small Chops in Nigeria",
  description:
    "Celebrating 16 years of baking mastery. Bespoke birthday cakes, thoughtful gifting cakes, cultural celebrations, fluffy doughnuts, savory meat pies, and authentic Nigerian small chops.",
  keywords: [
    "Hamtunes Cakes & Bakes",
    "Hamtunes Cakes",
    "Birthday cakes Nigeria",
    "Cakes for gifting",
    "Custom celebration cakes",
    "Doughnuts",
    "Cupcakes",
    "Meat pies",
    "Sausage rolls",
    "Small chops",
    "Event party catering",
  ],
  authors: [{ name: "Hamtunes Cakes & Bakes" }],
  openGraph: {
    title: "Hamtunes Cakes & Bakes | 16 Years of Handcrafted Baking Excellence",
    description:
      "Handcrafted celebration cakes, mini gifting cakes, fresh pastries, and authentic Nigerian small chops made for your special moments.",
    url: "https://hamtunescakes.com",
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Hamtunes Cakes & Bakes Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: BRAND.name,
    description:
      "Established Nigerian baking business with 16 years of experience offering custom celebration cakes, gifting cakes, pastries, and authentic party small chops.",
    telephone: BRAND.phoneDisplay,
    email: BRAND.email,
    url: "https://hamtunescakes.com",
    sameAs: [BRAND.instagramUrl],
    priceRange: "$$",
    servesCuisine: "Nigerian Bakery, Pastries & Celebration Cakes",
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
