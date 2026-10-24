import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { formatLagosMonthYear } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Privacy Policy | Hamtunes Cakes & Bakes",
  description:
    "Privacy Policy for Hamtunes Cakes & Bakes. Learn how we handle customer order information, enquiry details, and protect customer data.",
  alternates: {
    canonical: `${BRAND.siteUrl}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#F50057] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#F50057] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Customer Trust & Data Protection</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#351207]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#6F625C]">Last updated: {formatLagosMonthYear()}</p>
      </div>

      <div className="prose prose-stone text-sm text-[#6F625C] space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">1. Introduction</h2>
          <p>
            At <strong>Hamtunes Cakes & Bakes</strong>, we value the trust you place in us when
            entrusting us with your celebration cakes, party orders, and contact information. This
            privacy policy clarifies how we collect, handle, and protect your information when you use
            our website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">2. Information We Collect</h2>
          <p>
            When you initiate an enquiry through our website forms or WhatsApp links, we collect the
            following details that you voluntarily supply:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name and contact phone / WhatsApp number</li>
            <li>Your email address (if optionally provided)</li>
            <li>Your event dates, cake flavor/size preferences, and design reference photos</li>
            <li>Business name (for event planners and corporate partners)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">
            3. How We Use Your Information
          </h2>
          <p>
            Your information is used solely for the following legitimate business purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing your order enquiries and providing transparent pricing quotes</li>
            <li>Communicating regarding cake design specifications and delivery coordination</li>
            <li>Responding directly via WhatsApp or phone call</li>
          </ul>
          <p className="font-semibold text-[#351207]">
            We do not sell, rent, or trade your personal information to any third parties or advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">4. WhatsApp Communication</h2>
          <p>
            Our website facilitates direct click-to-chat links with WhatsApp. Please note that clicking
            these buttons opens the official WhatsApp application with a prefilled message. No message
            is sent automatically; you have complete manual control over whether you send the message to
            our official number (+234 803 397 6589).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to safeguard all enquiry submissions
            against unauthorized access, modification, or exposure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#351207]">6. Contact Us</h2>
          <p>
            If you have any questions or wish to request the deletion of your enquiry data, please
            contact us directly:
          </p>
          <div className="p-4 bg-[#FFF9F5] rounded-xl border border-[#E8DDD7] text-xs space-y-1">
            <p><strong>Business:</strong> Hamtunes Cakes & Bakes</p>
            <p><strong>Email:</strong> {BRAND.email}</p>
            <p><strong>Primary Line (Calls &amp; WhatsApp):</strong> {BRAND.primaryPhoneDisplay}</p>
            <p><strong>Secondary Line (Calls Only):</strong> {BRAND.secondaryPhoneDisplay}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
