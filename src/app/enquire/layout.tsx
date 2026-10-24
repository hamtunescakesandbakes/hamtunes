import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order & Enquire | Hamtunes Cakes & Bakes",
  description:
    "Place an order or request a quote from Hamtunes Cakes & Bakes. Share your cake inspiration, event date, and get fast WhatsApp or email response.",
  alternates: {
    canonical: `${BRAND.siteUrl}/enquire`,
  },
  keywords: [
    "Order Hamtunes cakes",
    "Hamtunes Cakes & Bakes order",
    "Custom cake consultation Lagos",
    "Cake baker contact Lagos",
    "Hamtunes WhatsApp order",
    "Cake quotation Nigeria",
  ],
  openGraph: {
    title: "Order & Enquire | Hamtunes Cakes & Bakes",
    description:
      "Place an order or request a quote from Hamtunes Cakes & Bakes. Share your cake inspiration, event date, and get fast WhatsApp or email response.",
    url: `${BRAND.siteUrl}/enquire`,
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Order & Enquire at Hamtunes Cakes & Bakes",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order & Enquire | Hamtunes Cakes & Bakes",
    description:
      "Place an order or request a quote from Hamtunes Cakes & Bakes. Share your cake inspiration, event date, and get fast WhatsApp or email response.",
    images: ["/images/logo.png"],
  },
};

export default function EnquireLayout({
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
        name: "Order & Enquire",
        item: `${BRAND.siteUrl}/enquire`,
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
