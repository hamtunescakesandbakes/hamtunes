import React from "react";
import Link from "next/link";
import { Cake, Gift, Users, Coffee, PartyPopper, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { getBakingExperience } from "@/lib/dates";

const exp = getBakingExperience();

const OCCASIONS = [
  {
    id: "birthday",
    title: "Celebrating a Birthday",
    subtitle: "Custom milestone, themed, and cartoon celebration cakes.",
    href: "/cakes?category=birthday_cakes",
    icon: Cake,
    badge: "Most Popular",
  },
  {
    id: "gifting",
    title: "Buying a Gift for Loved Ones",
    subtitle: "Thoughtful mini, bento, and personalized gifting cakes.",
    href: "/cakes?category=gifting_cakes",
    icon: Gift,
    badge: "Personalized",
  },
  {
    id: "event",
    title: "Planning an Event / Gathering",
    subtitle: "Full catering for dessert tables, cakes, and pastry platters.",
    href: "/event-planners",
    icon: Users,
    badge: "Bulk / Catering",
  },
  {
    id: "baked_treats",
    title: "Craving Fresh Baked Treats",
    subtitle: "Fluffy glazed doughnuts, cupcakes, and artisan pastries.",
    href: "/bakes-and-small-chops?category=doughnuts",
    icon: Coffee,
    badge: "Daily Fresh",
  },
  {
    id: "small_chops",
    title: "Need Party Small Chops",
    subtitle: "Authentic Nigerian small chops, meat pies, and sausage rolls.",
    href: "/bakes-and-small-chops?category=small_chops",
    icon: PartyPopper,
    badge: "Crowd Favorite",
  },
  {
    id: "custom",
    title: "I Have a Custom Design",
    subtitle: "Upload your design reference or share your vision with us.",
    href: "/enquire?type=cake",
    icon: Sparkles,
    badge: exp.short,
  },
  {
    id: "other",
    title: "Other / Bespoke Request",
    subtitle: "Have a unique idea or custom request? Tell us what you have in mind.",
    href: "/enquire?type=other",
    icon: HelpCircle,
    badge: "Custom Order",
  },
];

export default function OccasionDiscovery() {
  return (
    <section className="py-12 bg-[#FFF9F5] border-y border-[#E8DDD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
            Intelligent Product Discovery
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#351207] mt-1.5">
            What Are You Celebrating Today?
          </h2>
          <p className="text-sm text-[#6F625C] mt-2">
            Select your occasion to explore curated creations or initiate a tailored enquiry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OCCASIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group bg-[#FFFFFF] rounded-2xl p-6 border border-[#E8DDD7] hover:border-[#F50057] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F50057] group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#6F625C] px-2.5 py-0.5 rounded-full bg-[#F7EFE8]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#351207] group-hover:text-[#F50057] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6F625C] mt-1.5 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8DDD7]/50 flex items-center justify-between text-xs font-semibold text-[#F50057] group-hover:translate-x-1 transition-transform">
                  <span>Explore Choices</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
