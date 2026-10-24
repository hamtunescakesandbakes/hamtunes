import { NextResponse } from "next/server";
import { getAllProducts, getAllAdminProducts, saveProduct } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featuredOnly = searchParams.get("featured") === "true";
    const isAdmin = searchParams.get("admin") === "true";

    // Admin receives full unmasked products with private costs & approval status
    let products = isAdmin ? getAllAdminProducts() : getAllProducts();

    if (division) {
      products = products.filter((p) => p.division === division);
    }
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    if (featuredOnly) {
      products = products.filter((p) => p.is_featured);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.division || !body.category) {
      return NextResponse.json(
        { success: false, error: "Name, division, and category are required." },
        { status: 400 }
      );
    }

    const id = body.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct: Product = {
      id,
      name: body.name,
      slug,
      division: body.division,
      category: body.category,
      description: body.description || "",
      primary_image_id: body.primary_image_id || "",
      primary_image_url: body.primary_image_url || "/images/logo.png",
      gallery_images: body.gallery_images || [],
      
      // Pricing
      pricing_method: body.pricing_method || "starting_at",
      currency: "NGN",
      base_price: body.base_price !== undefined ? Number(body.base_price) : undefined,
      max_price: body.max_price !== undefined ? Number(body.max_price) : undefined,
      unit_label: body.unit_label || (body.division === "cakes" ? "cake" : "piece"),
      quantity_tiers: body.quantity_tiers || [],
      price_notes: body.price_notes || "",
      is_price_approved: Boolean(body.is_price_approved),
      private_costs: body.private_costs || undefined,

      is_featured: Boolean(body.is_featured),
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
      tags: body.tags || [],
      order_rank: body.order_rank || 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = saveProduct(newProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
