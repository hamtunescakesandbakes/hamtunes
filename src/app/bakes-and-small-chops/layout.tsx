import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hamtunes Baked Goods & Small Chops | Pastries, Doughnuts & Meat Pies",
  description:
    "Discover fresh baked goods and authentic Nigerian small chops from Hamtunes Cakes & Bakes. Handcrafted doughnuts, decorated cupcakes, flaky meat pies, sausage rolls, and event platters.",
  alternates: {
    canonical: `${BRAND.siteUrl}/bakes-and-small-chops`,
  },
  keywords: [
    "Hamtunes baked goods",
    "Doughnuts",
    "Cupcakes",
    "Meat pies",
    "Egg rolls",
    "Sausage rolls",
    "Small chops",
    "Hamtunes Cakes & Bakes",
    "Nigerian small chops Lagos",
    "Party finger foods Lagos",
  ],
  openGraph: {
    title: "Hamtunes Baked Goods & Small Chops | Pastries, Doughnuts & Meat Pies",
    description:
      "Discover fresh baked goods and authentic Nigerian small chops from Hamtunes Cakes & Bakes. Handcrafted doughnuts, decorated cupcakes, flaky meat pies, sausage rolls, and event platters.",
    url: `${BRAND.siteUrl}/bakes-and-small-chops`,
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Hamtunes Bakes & Small Chops Collection",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamtunes Baked Goods & Small Chops | Pastries, Doughnuts & Meat Pies",
    description:
      "Discover fresh baked goods and authentic Nigerian small chops from Hamtunes Cakes & Bakes. Handcrafted doughnuts, decorated cupcakes, flaky meat pies, sausage rolls, and event platters.",
    images: ["/images/logo.png"],
  },
};

export default function BakesLayout({
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
        name: "Bakes & Small Chops",
        item: `${BRAND.siteUrl}/bakes-and-small-chops`,
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
