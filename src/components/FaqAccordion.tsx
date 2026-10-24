"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Cakes",
    question: "What cake varieties and celebrations does Hamtunes cater to?",
    answer:
      "With 16 years of baking experience, Hamtunes crafts custom birthday cakes, personalized cakes for gifting loved ones, cultural celebration cakes (traditional weddings & introductions), anniversary cakes, graduation cakes, and bespoke centerpieces. Even if you don't see an exact photo of your desired theme in the portfolio, we create custom designs based on your specifications or reference photos.",
  },
  {
    category: "Gifting",
    question: "Can I order a smaller personalized cake as a surprise gift?",
    answer:
      "Yes! We specialize in thoughtful gifting cakes and mini celebration cakes. You can customize the inscription, color scheme, and flavor to surprise a partner, friend, parent, or colleague.",
  },
  {
    category: "Bakes & Small Chops",
    question: "What baked goods and small chops are available for order?",
    answer:
      "Our Bakes & Small Chops division offers fluffy glazed and sprinkle doughnuts, artisan decorated cupcakes, golden flaky meat pies, spiced sausage rolls, and authentic Nigerian party small chops including puff-puff, finger food platters, and snack gift boxes.",
  },
  {
    category: "Ordering",
    question: "How do custom orders and pricing enquiries work?",
    answer:
      "Because every celebration is unique, pricing depends on cake size, tier count, intricate decorations, and pastry quantities. You can submit your requirements via our Enquire page or click any 'Chat on WhatsApp' button to receive an instant, transparent quote directly from our baker.",
  },
  {
    category: "Events",
    question: "Do you supply cakes and small chops in bulk for event planners and parties?",
    answer:
      "Yes! We collaborate directly with families, party hosts, corporate clients, and event planners to cater full dessert tables, celebration cakes, and finger food platters with punctual delivery across event venues.",
  },
  {
    category: "Contact",
    question: "What is the best way to contact Hamtunes Cakes & Bakes?",
    answer:
      "You can chat with us instantly on WhatsApp at +234 803 397 6589, call our direct line at 0904 957 1104, email hamtunescakesandbakes89@gmail.com, or connect on Instagram @hamtunescakes.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-[#F50057] bg-[#FFF9F5]"
                : "border-[#E8DDD7] bg-[#FFFFFF] hover:border-[#D5004C]/40"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#351207] focus:outline-none"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#F50057] transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6F625C] leading-relaxed border-t border-[#E8DDD7]/50">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
