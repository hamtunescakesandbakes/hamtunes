"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";
import { buildEventPlannerChatLink, buildWhatsAppLink } from "@/lib/whatsapp";
import { BRAND } from "@/lib/constants";

export default function EventPlannersPage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    business_name: "",
    phone_number: "",
    email: "",
    enquiry_type: "event_planner",
    product_categories: [] as string[],
    event_date: "",
    cake_size_or_quantity: "",
    design_notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    whatsappUrl: string;
    enquiryId: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const eventCategories = [
    { id: "cakes", label: "Celebration & Multi-Tier Cakes" },
    { id: "dessert_table", label: "Dessert Table Treats (Cupcakes & Doughnuts)" },
    { id: "small_chops", label: "Savory Small Chops (Puff-Puff, Spring Rolls, Samosas)" },
    { id: "pastries", label: "Party Pastries (Meat Pies & Sausage Rolls)" },
    { id: "snack_jars", label: "Individual Snack Jars / Favor Packs" },
  ];

  const handleCategoryToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.product_categories.includes(id);
      return {
        ...prev,
        product_categories: exists
          ? prev.product_categories.filter((c) => c !== id)
          : [...prev.product_categories, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessResult({
          whatsappUrl: data.whatsappUrl,
          enquiryId: data.enquiry.id,
        });
      } else {
        setErrorMsg(data.error || "Unable to submit enquiry. Please try again or chat via WhatsApp.");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Please try again or reach out on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const directPlannerChatUrl = buildEventPlannerChatLink();

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO */}
      <section className="bg-gradient-to-b from-[#FFF9F5] via-[#FFFFFF] to-[#FFF9F5] py-16 border-b border-[#E8DDD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Event Planners & Corporate Hosts</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#351207]">
              A Cake & Baking Partner for Your Events
            </h1>

            <p className="text-base sm:text-lg text-[#6F625C] leading-relaxed">
              Elevate your clients&apos; weddings, milestone anniversaries, corporate banquets, and
              celebrations with handcrafted cakes and freshly prepared savory small chops, backed by
              16 years of consistent baking excellence.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#planner-form"
                className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-full shadow-md transition-all"
              >
                <span>Submit Partnership Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={directPlannerChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-semibold px-5 py-3.5 rounded-full shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Chat with Baker on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY PARTNER WITH HAMTUNES (16 Years Experience) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
            Professional Reliability
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207] mt-1.5">
            Built for Planners Who Value Dependability
          </h2>
          <p className="text-sm text-[#6F625C] mt-2">
            We understand that as an event planner, your reputation relies on punctual delivery,
            exceptional taste, and stunning visual presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-8 rounded-2xl border border-[#E8DDD7] space-y-3 hover:border-[#F50057]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#351207]">
              16 Years of Proven Experience
            </h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              We bring seasoned expertise handling large guest counts, complex multi-tier wedding
              structures, and temperature-sensitive deliveries.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl border border-[#E8DDD7] space-y-3 hover:border-[#F50057]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#351207]">
              Cakes & Small Chops from One Source
            </h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Streamline your vendor coordination. Order both the centerpiece celebration cake and the
              piping-hot cocktail finger foods from one trusted bakery.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-8 rounded-2xl border border-[#E8DDD7] space-y-3 hover:border-[#F50057]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#351207]">
              Clear Communication & Coordination
            </h3>
            <p className="text-xs text-[#6F625C] leading-relaxed">
              Direct access to our lead baker via phone and WhatsApp ensures design alignment, prompt
              updates, and flexible event coordination.
            </p>
          </div>
        </div>
      </section>

      {/* 3. PARTNERSHIP ENQUIRY FORM */}
      <section id="planner-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8DDD7] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="border-b border-[#E8DDD7] pb-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
              Vendor Partnership Request
            </span>
            <h2 className="font-serif font-black text-2xl text-[#351207]">
              Submit Your Event or Vendor Enquiry
            </h2>
            <p className="text-xs text-[#6F625C]">
              Share your upcoming event specifics or discuss ongoing vendor arrangements.
            </p>
          </div>

          {successResult ? (
            <div className="bg-[#FFF9F5] border border-[#F50057]/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#351207]">
                Enquiry Received with Thanks!
              </h3>
              <p className="text-xs sm:text-sm text-[#6F625C] max-w-md mx-auto leading-relaxed">
                Your partnership details have been securely saved (Ref: #{successResult.enquiryId}).
                Click below to immediately continue this conversation on WhatsApp with our baker.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={successResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>Continue on WhatsApp with Prefilled Message</span>
                </a>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="w-full sm:w-auto text-xs text-[#6F625C] hover:text-[#351207] underline py-2"
                >
                  Submit Another Event
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Your Name <span className="text-[#F50057]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kemi Adeyemi"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Grand Moments Events"
                    value={formData.business_name}
                    onChange={(e) =>
                      setFormData({ ...formData, business_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    WhatsApp / Phone Number <span className="text-[#F50057]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0803 123 4567"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., info@grandevents.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>
              </div>

              {/* Product Categories Needed */}
              <div>
                <label className="block text-xs font-bold text-[#351207] mb-2">
                  Product Categories Needed for Your Events:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {eventCategories.map((cat) => {
                    const checked = formData.product_categories.includes(cat.id);
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          checked
                            ? "border-[#F50057] bg-[#FFF0F5] text-[#F50057]"
                            : "border-[#E8DDD7] hover:bg-[#F7EFE8] text-[#351207]"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {checked && <CheckCircle2 className="w-4 h-4 text-[#F50057] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Event Date (if known)
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#351207] mb-1">
                    Estimated Guest Count / Quantities
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 200 guests, 150 snack packs"
                    value={formData.cake_size_or_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cake_size_or_quantity: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#351207] mb-1">
                  Additional Notes or Partnership Vision
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details on your clients' themes, venue location, or recurring vendor arrangement..."
                  value={formData.design_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, design_notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD7] text-sm focus:outline-none focus:border-[#F50057]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Event Partnership Enquiry</span>
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
