import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hamtunes Cakes | Birthday, Custom & Gifting Cakes in Lagos",
  description:
    "Explore handcrafted celebration cakes by Hamtunes Cakes & Bakes. From custom birthday cakes and gifting mini cakes to cultural celebration centerpieces in Lagos.",
  alternates: {
    canonical: `${BRAND.siteUrl}/cakes`,
  },
  keywords: [
    "Hamtunes cakes",
    "Birthday cakes",
    "Personalised cakes",
    "Cakes for gifting",
    "Cultural cakes",
    "Custom celebration cakes",
    "Hamtunes custom cakes",
    "Hamtunes Cakes & Bakes",
    "Lagos birthday cakes",
    "Wedding cakes Lagos",
  ],
  openGraph: {
    title: "Hamtunes Cakes | Birthday, Custom & Gifting Cakes in Lagos",
    description:
      "Explore handcrafted celebration cakes by Hamtunes Cakes & Bakes. From custom birthday cakes and gifting mini cakes to cultural celebration centerpieces.",
    url: `${BRAND.siteUrl}/cakes`,
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Hamtunes Celebration Cakes Collection",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamtunes Cakes | Birthday, Custom & Gifting Cakes in Lagos",
    description:
      "Explore handcrafted celebration cakes by Hamtunes Cakes & Bakes. From custom birthday cakes and gifting mini cakes to cultural celebration centerpieces.",
    images: ["/images/logo.png"],
  },
};

export default function CakesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        name: "Hamtunes Cakes",
        item: `${BRAND.siteUrl}/cakes`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
