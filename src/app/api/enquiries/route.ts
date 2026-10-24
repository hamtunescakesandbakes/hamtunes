import { NextResponse } from "next/server";
import { createEnquiry, getAllEnquiries } from "@/lib/db";
import { generateWhatsAppEnquiryMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export async function GET() {
  try {
    const enquiries = getAllEnquiries();
    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customer_name || !body.phone_number) {
      return NextResponse.json(
        { success: false, error: "Name and Phone / WhatsApp number are required." },
        { status: 400 }
      );
    }

    const newEnquiry = createEnquiry({
      customer_name: String(body.customer_name).trim(),
      phone_number: String(body.phone_number).trim(),
      email: body.email ? String(body.email).trim() : undefined,
      business_name: body.business_name ? String(body.business_name).trim() : undefined,
      enquiry_type: body.enquiry_type || "general",
      product_categories: Array.isArray(body.product_categories) ? body.product_categories : [],
      products_interested: body.products_interested ? String(body.products_interested).trim() : undefined,
      event_date: body.event_date ? String(body.event_date).trim() : undefined,
      cake_size_or_quantity: body.cake_size_or_quantity ? String(body.cake_size_or_quantity).trim() : undefined,
      design_notes: body.design_notes ? String(body.design_notes).trim() : undefined,
      budget_range: body.budget_range ? String(body.budget_range).trim() : undefined,
      reference_image_url: body.reference_image_url || undefined,
      collection_or_delivery: body.collection_or_delivery || "undecided",
      status: "new",
      internal_notes: "",
    });

    // Generate pre-populated WhatsApp message link
    const whatsappMessage = generateWhatsAppEnquiryMessage(newEnquiry);
    const whatsappUrl = buildWhatsAppLink(whatsappMessage);

    return NextResponse.json({
      success: true,
      enquiry: newEnquiry,
      whatsappUrl,
      whatsappMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
