async function testSeo() {
  const routes = [
    "/",
    "/cakes",
    "/bakes-and-small-chops",
    "/event-planners",
    "/enquire",
    "/products/bratz-birthday-cake-and-cupcakes-for-desola",
    "/sitemap.xml",
    "/robots.txt",
    "/admin",
  ];

  console.log("=== COMPREHENSIVE SEO VALIDATION ===");

  for (const r of routes) {
    try {
      const res = await fetch("http://localhost:3000" + r);
      const text = await res.text();
      console.log(`\nROUTE: ${r} | Status: ${res.status} | Content-Type: ${res.headers.get("content-type")}`);

      if (r === "/sitemap.xml") {
        console.log("  Sitemap Preview:");
        console.log(text.substring(0, 350) + "...\n");
        console.log("  Contains <image:loc>:", text.includes("<image:loc>"));
        console.log("  Contains <image:title>:", text.includes("<image:title>"));
        console.log("  Contains <image:caption>:", text.includes("<image:caption>"));
        const locCount = (text.match(/<loc>/g) || []).length;
        console.log(`  Total Indexable URLs in Sitemap: ${locCount}`);
      } else if (r === "/robots.txt") {
        console.log("  Robots.txt Content:\n" + text);
      } else {
        const titleMatch = text.match(/<title>([^<]+)<\/title>/);
        const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const canonicalMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        const hasSchema = text.includes("application/ld+json");

        console.log("  Title:", titleMatch ? titleMatch[1] : "NOT FOUND");
        console.log("  Description:", descMatch ? descMatch[1] : "NOT FOUND");
        console.log("  Canonical:", canonicalMatch ? canonicalMatch[1] : "NOT FOUND");
        console.log("  JSON-LD Structured Data:", hasSchema ? "YES (Present)" : "NO");

        if (r === "/admin") {
          const robotsMeta = text.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
          console.log("  Admin Robots Directive:", robotsMeta ? robotsMeta[1] : "NOT FOUND");
        }
      }
    } catch (err: any) {
      console.error(`Error requesting ${r}:`, err.message);
    }
  }
}

testSeo();
