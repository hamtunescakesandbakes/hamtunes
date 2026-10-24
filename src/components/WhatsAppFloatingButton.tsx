"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { buildGeneralChatLink } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const whatsAppUrl = buildGeneralChatLink();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Gentle helper bubble */}
      {tooltipVisible && (
        <div className="pointer-events-auto mb-2 bg-[#351207] text-[#FFFFFF] text-xs font-medium py-2 px-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-[#F50057]/40 max-w-[240px] animate-in fade-in slide-in-from-bottom-2">
          <span>Need help or want to order? Chat on WhatsApp!</span>
          <button
            onClick={() => setTooltipVisible(false)}
            className="text-[#F7EFE8]/70 hover:text-white p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xl hover:scale-108 active:scale-95 transition-all group ring-4 ring-white/80 focus:outline-none focus:ring-4 focus:ring-[#F50057]"
        aria-label="Chat directly on WhatsApp with Hamtunes Cakes & Bakes"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366] group-hover:scale-105 transition-transform" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
