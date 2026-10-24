import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { BRAND } from "@/lib/constants";

export const revalidate = 60; // Refresh sitemap cache dynamically

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = BRAND.siteUrl;
  const products = getAllProducts();
  const currentDate = new Date().toISOString().split("T")[0];

  const cakeProducts = products.filter((p) => p.division === "cakes");
  const bakesProducts = products.filter((p) => p.division === "bakes_and_small_chops");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- 1. HOMEPAGE -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/images/logo.png</image:loc>
      <image:title>Hamtunes Cakes &amp; Bakes Official Logo</image:title>
      <image:caption>Official logo of Hamtunes Cakes &amp; Bakes featuring signature hot pink and chocolate brown tones</image:caption>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/images/owner.jpg</image:loc>
      <image:title>Hamtunes Cakes &amp; Bakes Founder &amp; Master Baker</image:title>
      <image:caption>Master baker with ${BRAND.experienceYears} years of culinary craft at Hamtunes Cakes &amp; Bakes</image:caption>
    </image:image>
  </url>

  <!-- 2. CAKES DIRECTORY -->
  <url>
    <loc>${baseUrl}/cakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
${cakeProducts
  .slice(0, 50)
  .map(
    (p) => `    <image:image>
      <image:loc>${p.primary_image_url.startsWith("http") ? p.primary_image_url : `${baseUrl}${p.primary_image_url}`}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
      <image:caption>${escapeXml(p.name)} handcrafted by Hamtunes Cakes &amp; Bakes</image:caption>
    </image:image>`
  )
  .join("\n")}
  </url>

  <!-- 3. BAKES & SMALL CHOPS DIRECTORY -->
  <url>
    <loc>${baseUrl}/bakes-and-small-chops</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
${bakesProducts
  .slice(0, 50)
  .map(
    (p) => `    <image:image>
      <image:loc>${p.primary_image_url.startsWith("http") ? p.primary_image_url : `${baseUrl}${p.primary_image_url}`}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
      <image:caption>${escapeXml(p.name)} prepared by Hamtunes Cakes &amp; Bakes</image:caption>
    </image:image>`
  )
  .join("\n")}
  </url>

  <!-- 4. EVENT PLANNERS HUB -->
  <url>
    <loc>${baseUrl}/event-planners</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 5. ENQUIRE & ORDER HUB -->
  <url>
    <loc>${baseUrl}/enquire</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 6. PRIVACY POLICY -->
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- 7. INDIVIDUAL PRODUCT & GOOGLE IMAGE LANDING PAGES -->
${products
  .map((p) => {
    const pDate = p.updated_at ? p.updated_at.split("T")[0] : currentDate;
    const fullImgUrl = p.primary_image_url.startsWith("http")
      ? p.primary_image_url
      : `${baseUrl}${p.primary_image_url}`;
    return `  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${pDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${fullImgUrl}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
      <image:caption>${escapeXml(p.name)} handcrafted by Hamtunes Cakes &amp; Bakes in Lagos</image:caption>
    </image:image>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
