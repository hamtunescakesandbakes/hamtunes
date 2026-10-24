"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  MessageCircle,
  Phone,
  Mail,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Cake,
  Coffee,
  Users,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { BRAND } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function EnquireContent() {
  const searchParams = useSearchParams();

  const [enquiryType, setEnquiryType] = useState<string>("cake");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [cakeSize, setCakeSize] = useState("");
  const [budget, setBudget] = useState("");
  const [collectionDelivery, setCollectionDelivery] = useState("undecided");
  const [details, setDetails] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{
    whatsappUrl: string;
    enquiryId: string;
  } | null>(null);

  // Read URL query parameters for prefilling
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const productParam = searchParams.get("product");
    const categoryParam = searchParams.get("category");

    if (typeParam) {
      setEnquiryType(typeParam);
    }
    if (productParam) {
      setSelectedProduct(productParam);
      setDetails(`Enquiring about: ${productParam} (${categoryParam || ""})`);
    }
  }, [searchParams]);

  // Handle reference image upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReferenceFile(file);
    setUploadingImage(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setReferenceImageUrl(data.url);
      } else {
        setErrorMsg("Failed to upload reference photo. You can still submit without it.");
      }
    } catch (err) {
      setErrorMsg("Image upload failed. You can proceed without an attachment.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        phone_number: phoneNumber,
        email,
        enquiry_type: enquiryType,
        products_interested: selectedProduct || undefined,
        event_date: eventDate || undefined,
        cake_size_or_quantity: cakeSize || undefined,
        design_notes: details || undefined,
        budget_range: budget || undefined,
        reference_image_url: referenceImageUrl || undefined,
        collection_or_delivery: collectionDelivery,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          whatsappUrl: data.whatsappUrl,
          enquiryId: data.enquiry.id,
        });
      } else {
        setErrorMsg(data.error || "Could not save enquiry. Please reach out via WhatsApp.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again or chat with us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const directWhatsApp = buildWhatsAppLink(
    "👋 Hello Hamtunes Cakes & Bakes! I would like to make an enquiry."
  );

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO */}
      <section className="bg-gradient-to-b from-[#FFF9F5] via-[#FFFFFF] to-[#FFF9F5] py-16 border-b border-[#E8DDD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central Contact & Ordering Hub</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#351207]">
            Make an Enquiry with Hamtunes
          </h1>

          <p className="text-base sm:text-lg text-[#6F625C] max-w-2xl mx-auto leading-relaxed">
            Whether you need a custom celebration cake, personalized gift, or fresh small chops for a
            party, we are here to bring 16 years of baking experience to your special occasion.
          </p>
        </div>
      </section>

      {/* 2. DIRECT CONTACT CHANNELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={directWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD7] hover:border-[#25D366] hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 fill-[#25D366] text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-[#6F625C]">Direct WhatsApp</div>
              <div className="font-semibold text-sm text-[#351207]">{BRAND.whatsAppDisplay}</div>
            </div>
          </a>

          <a
            href={BRAND.phoneTel}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD7] hover:border-[#F50057] hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-[#6F625C]">Telephone Line</div>
              <div className="font-semibold text-sm text-[#351207]">{BRAND.phoneDisplay}</div>
            </div>
          </a>

          <a
            href={BRAND.emailMailto}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD7] hover:border-[#F50057] hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold uppercase text-[#6F625C]">Email Us</div>
              <div className="font-semibold text-xs text-[#351207] truncate">{BRAND.email}</div>
            </div>
          </a>

          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8DDD7] hover:border-[#F50057] hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-[#6F625C]">Instagram</div>
              <div className="font-semibold text-sm text-[#351207]">{BRAND.instagramHandle}</div>
            </div>
          </a>
        </div>
      </section>

      {/* 3. MULTI-MODE ENQUIRY FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8DDD7] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="border-b border-[#E8DDD7] pb-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
              Step-by-Step Consultation
            </span>
            <h2 className="font-serif font-black text-2xl text-[#351207]">
              Tell Us What You Need
            </h2>
            <p className="text-xs text-[#6F625C]">
              Complete as much or as little as you know. We will assist you with the rest.
            </p>
          </div>

          {result ? (
            /* Submission Success State */
            <div className="bg-[#FFF9F5] border border-[#F50057]/30 rounded-2xl p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif font-black text-2xl text-[#351207]">
                Enquiry Saved Successfully!
              </h3>
              <p className="text-sm text-[#6F625C] max-w-md mx-auto leading-relaxed">
                Your request has been logged in our secure system (Reference: #{result.enquiryId}).
                Click below to continue directly to WhatsApp with your prefilled details to finalize your
                quote.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Send Prefilled WhatsApp Message</span>
                </a>

                <button
                  onClick={() => {
                    setResult(null);
                    setCustomerName("");
                    setPhoneNumber("");
                    setDetails("");
                    setReferenceImageUrl("");
                  }}
                  className="w-full sm:w-auto text-xs text-[#6F625C] hover:text-[#351207] underline py-2"
                >
                  Start Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Enquiry Type Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-[#351207] mb-2">
                  What are you enquiring about?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "cake", label: "Celebration Cake", icon: Cake },
                    { id: "gifting_cake", label: "Gift / Mini Cake", icon: Sparkles },
                    { id: "bakes_and_small_chops", label: "Bakes & Small Chops", icon: Coffee },
                    { id: "event", label: "Event Catering", icon: Users },
                  ].map((tab) => {
                    const active = enquiryType === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setEnquiryType(tab.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                          active
                            ? "border-[#F50057] bg-[#FFF0F5] text-[#F50057] shadow-xs"
                            : "border-[#E8DDD7] text-[#351207] hover:bg-[#F7EFE8]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Your Name <span className="text-[#F50057]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Bolanle Okon"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    WhatsApp / Telephone Number <span className="text-[#F50057]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0803 397 6589"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Required Date / Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Size, Tier Count, or Quantity (if known)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2-tier 10-inch, or 50 pieces small chops"
                    value={cakeSize}
                    onChange={(e) => setCakeSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>
              </div>

              {/* Delivery or Collection Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Preference for Fulfillment
                  </label>
                  <select
                    value={collectionDelivery}
                    onChange={(e) => setCollectionDelivery(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057] bg-white"
                  >
                    <option value="undecided">Undecided / Discuss with Baker</option>
                    <option value="delivery">Delivery to Venue / Address</option>
                    <option value="collection">Self-Pickup / Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Estimated Budget Range (Optional)
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057] bg-white"
                  >
                    <option value="">Select or leave open for consultation</option>
                    <option value="Flexible / Recommend for occasion">Flexible / Recommend based on my needs</option>
                    <option value="Under ₦25,000">Under ₦25,000 (Mini/Gifting cakes, pastries, treat boxes)</option>
                    <option value="₦25,000 – ₦50,000">₦25,000 – ₦50,000 (Single-tier custom cakes, party small chops)</option>
                    <option value="₦50,000 – ₦100,000">₦50,000 – ₦100,000 (Deluxe birthday cakes, celebratory platters)</option>
                    <option value="₦100,000 – ₦250,000">₦100,000 – ₦250,000 (Two-tier milestone cakes, event finger foods)</option>
                    <option value="₦250,000+">₦250,000+ (Multi-tier wedding centerpieces & grand catering)</option>
                  </select>
                </div>
              </div>

              {/* Reference Image Upload */}
              <div>
                <label className="block text-xs font-bold text-[#351207] mb-1">
                  Have a Reference Photo or Inspiration Image? (Optional)
                </label>
                <div className="border-2 border-dashed border-[#E8DDD7] hover:border-[#F50057]/50 rounded-2xl p-5 text-center transition-colors bg-[#FFF9F5]/50">
                  {referenceImageUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border">
                        <Image
                          src={referenceImageUrl}
                          alt="Uploaded reference"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                        </p>
                        <button
                          type="button"
                          onClick={() => setReferenceImageUrl("")}
                          className="text-[11px] text-red-600 underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingImage}
                        id="reference-upload"
                        className="hidden"
                      />
                      <label
                        htmlFor="reference-upload"
                        className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold text-[#F50057] hover:underline"
                      >
                        <Upload className="w-4 h-4" />
                        <span>
                          {uploadingImage
                            ? "Optimizing & uploading..."
                            : "Click to upload a cake/pastry reference image"}
                        </span>
                      </label>
                      <p className="text-[11px] text-[#6F625C] mt-1">PNG, JPG, or WebP</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Design Notes */}
              <div>
                <label className="block text-xs font-bold text-[#351207] mb-1">
                  Design Details, Inscription, or Specific Requests
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the theme, preferred cake flavors (Vanilla, Red Velvet, Chocolate), colors, inscriptions, or event details..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold py-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Recording Your Request...</span>
                ) : (
                  <>
                    <span>Submit Enquiry & Generate WhatsApp Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default function EnquirePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-[#6F625C]">
          Loading enquiry options...
        </div>
      }
    >
      <EnquireContent />
    </Suspense>
  );
}
