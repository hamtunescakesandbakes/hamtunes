import { NextResponse } from "next/server";
import { updateEnquiry, getEnquiryById } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = getEnquiryById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    const updated = updateEnquiry(id, {
      status: body.status,
      internal_notes: body.internal_notes,
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
