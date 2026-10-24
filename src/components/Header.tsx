"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, Phone, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { buildGeneralChatLink } from "@/lib/whatsapp";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cakes", label: "Cakes" },
    { href: "/bakes-and-small-chops", label: "Bakes & Small Chops" },
    { href: "/event-planners", label: "Event Planners" },
    { href: "/enquire", label: "Enquire" },
  ];

  const whatsAppUrl = buildGeneralChatLink();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8DDD7] transition-all">
      {/* Top experience micro-banner */}
      <div className="bg-[#351207] text-[#FFF9F5] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F50057]" />
        <span>Hamtunes Cakes &amp; Bakes — Celebrating {BRAND.experienceYears} Years of Handcrafted Excellence</span>
        <span className="hidden sm:inline opacity-70">|</span>
        <a
          href={BRAND.primaryPhoneTel}
          className="hidden sm:inline hover:text-[#F50057] transition-colors"
          title="Primary: Calls & WhatsApp"
        >
          Call / WhatsApp: {BRAND.primaryPhoneDisplay}
        </a>
        <span className="hidden md:inline opacity-70">|</span>
        <a
          href={BRAND.secondaryPhoneTel}
          className="hidden md:inline hover:text-[#F50057] transition-colors opacity-80"
          title="Secondary: Calls Only"
        >
          Call Only: {BRAND.secondaryPhoneDisplay}
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#F50057] shadow-sm group-hover:scale-105 transition-transform bg-[#FFF9F5]">
              <Image
                src="/images/logo.png"
                alt="Hamtunes Cakes & Bakes Official Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#351207] group-hover:text-[#F50057] transition-colors">
                Hamtunes
              </span>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[#F50057] -mt-1">
                Cakes & Bakes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    isActive
                      ? "text-[#F50057]"
                      : "text-[#351207] hover:text-[#F50057]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F50057] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={BRAND.phoneTel}
              className="p-2.5 rounded-full text-[#351207] hover:bg-[#F7EFE8] transition-colors"
              title="Call Hamtunes"
              aria-label="Call Hamtunes"
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#F50057]" />
              <span>WhatsApp Chat</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#F50057] text-white shadow-sm"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#F50057]" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#351207] hover:bg-[#F7EFE8] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E8DDD7] px-4 pt-2 pb-6 space-y-2 shadow-xl animate-fade-in-up">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive
                    ? "bg-[#FFF0F5] text-[#F50057]"
                    : "text-[#351207] hover:bg-[#F7EFE8]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#E8DDD7] space-y-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#F50057] text-white font-semibold py-3 rounded-lg shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#F50057]" />
              <span>Chat on WhatsApp ({BRAND.primaryPhoneDisplay})</span>
            </a>
            <a
              href={BRAND.primaryPhoneTel}
              className="flex items-center justify-center gap-2 w-full bg-[#F7EFE8] text-[#351207] font-semibold py-2.5 rounded-lg border border-[#E8DDD7]"
            >
              <Phone className="w-4 h-4 text-[#F50057]" />
              <span>Call Primary ({BRAND.primaryPhoneDisplay})</span>
            </a>
            <a
              href={BRAND.secondaryPhoneTel}
              className="flex items-center justify-center gap-2 w-full bg-white text-[#6F625C] text-xs font-semibold py-2 rounded-lg border border-[#E8DDD7]"
            >
              <Phone className="w-3.5 h-3.5 text-[#6F625C]" />
              <span>Call Secondary ({BRAND.secondaryPhoneDisplay} — Calls Only)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
