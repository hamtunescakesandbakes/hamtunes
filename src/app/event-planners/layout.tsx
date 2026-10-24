import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Event Planners & Corporate Catering | Hamtunes Cakes & Bakes",
  description:
    "Partner with Hamtunes Cakes & Bakes for seamless event catering in Lagos. Bespoke celebration cakes, dessert tables, and authentic Nigerian small chops for weddings and corporate gatherings.",
  alternates: {
    canonical: `${BRAND.siteUrl}/event-planners`,
  },
  keywords: [
    "Event planners cake vendor Lagos",
    "Corporate catering cakes Lagos",
    "Wedding cakes Lagos vendor",
    "Party small chops wholesale",
    "Hamtunes Cakes & Bakes catering",
    "Dessert table catering Lagos",
    "Bakery event partnership",
  ],
  openGraph: {
    title: "Event Planners & Corporate Catering | Hamtunes Cakes & Bakes",
    description:
      "Partner with Hamtunes Cakes & Bakes for seamless event catering in Lagos. Bespoke celebration cakes, dessert tables, and authentic Nigerian small chops.",
    url: `${BRAND.siteUrl}/event-planners`,
    siteName: "Hamtunes Cakes & Bakes",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 1200,
        alt: "Hamtunes Event Planners & Catering",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Planners & Corporate Catering | Hamtunes Cakes & Bakes",
    description:
      "Partner with Hamtunes Cakes & Bakes for seamless event catering in Lagos. Bespoke celebration cakes, dessert tables, and authentic Nigerian small chops.",
    images: ["/images/logo.png"],
  },
};

export default function EventPlannersLayout({
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
        name: "Event Planners",
        item: `${BRAND.siteUrl}/event-planners`,
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
