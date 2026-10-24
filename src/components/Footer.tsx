import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, Mail, Sparkles, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { BRAND } from "@/lib/constants";
import { buildGeneralChatLink } from "@/lib/whatsapp";

export default function Footer() {
  const whatsAppUrl = buildGeneralChatLink();

  return (
    <footer className="bg-[#351207] text-[#FFF9F5] border-t-4 border-[#F50057]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & 16-Year Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F50057] bg-white">
                <Image
                  src="/images/logo.png"
                  alt="Hamtunes Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-[#FFFFFF]">Hamtunes</h3>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#F50057]">
                  Cakes & Bakes
                </p>
              </div>
            </div>

            <p className="text-sm text-[#F7EFE8]/80 leading-relaxed">
              Handcrafting bespoke celebration cakes, thoughtful gifting cakes, fresh pastries,
              and authentic Nigerian small chops with 16 years of baking mastery.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5A2718] border border-[#E8DDD7]/20 text-xs font-semibold text-[#FFF9F5]">
              <Sparkles className="w-3.5 h-3.5 text-[#F50057]" />
              <span>16 Years of Baking Excellence</span>
            </div>
          </div>

          {/* Col 2: Divisions & Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F50057] mb-4">
              Explore Offerings
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/cakes"
                  className="hover:text-[#F50057] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F50057]" />
                  <span>Celebration & Custom Cakes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cakes?category=birthday_cakes"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors pl-3.5 block"
                >
                  Birthday Cakes
                </Link>
              </li>
              <li>
                <Link
                  href="/cakes?category=gifting_cakes"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors pl-3.5 block"
                >
                  Cakes for Gifting & Loved Ones
                </Link>
              </li>
              <li>
                <Link
                  href="/bakes-and-small-chops"
                  className="hover:text-[#F50057] transition-colors flex items-center gap-2 pt-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F50057]" />
                  <span>Bakes & Small Chops</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bakes-and-small-chops?category=doughnuts"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors pl-3.5 block"
                >
                  Fresh Doughnuts & Cupcakes
                </Link>
              </li>
              <li>
                <Link
                  href="/bakes-and-small-chops?category=meat_pies"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors pl-3.5 block"
                >
                  Meat Pies & Sausage Rolls
                </Link>
              </li>
              <li>
                <Link
                  href="/bakes-and-small-chops?category=small_chops"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors pl-3.5 block"
                >
                  Party Small Chops & Finger Foods
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Enquiries & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F50057] mb-4">
              Planning & Orders
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/event-planners"
                  className="hover:text-[#F50057] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F50057]" />
                  <span>Event Planners & Partners</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/enquire?type=cake"
                  className="hover:text-[#F50057] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F50057]" />
                  <span>Custom Cake Consultation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/enquire?type=bakes_and_small_chops"
                  className="hover:text-[#F50057] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F50057]" />
                  <span>Party Platter & Bulk Orders</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[#F7EFE8]/75 hover:text-[#F50057] transition-colors block pt-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[#F7EFE8]/60 hover:text-[#F50057] transition-colors block text-xs"
                >
                  Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F50057] mb-4">
              Official Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#5A2718]/60 hover:bg-[#F50057] transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-[#F50057] group-hover:text-white transition-colors" />
                <div>
                  <div className="text-[11px] text-[#F7EFE8]/70">WhatsApp Orders</div>
                  <div className="font-semibold">{BRAND.whatsAppDisplay}</div>
                </div>
              </a>

              <a
                href={BRAND.phoneTel}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#5A2718]/60 hover:bg-[#F50057] transition-all group"
              >
                <Phone className="w-4 h-4 text-[#F50057] group-hover:text-white transition-colors" />
                <div>
                  <div className="text-[11px] text-[#F7EFE8]/70">Telephone Line</div>
                  <div className="font-semibold">{BRAND.phoneDisplay}</div>
                </div>
              </a>

              <a
                href={BRAND.emailMailto}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#5A2718]/60 hover:bg-[#F50057] transition-all group"
              >
                <Mail className="w-4 h-4 text-[#F50057] group-hover:text-white transition-colors" />
                <div className="overflow-hidden">
                  <div className="text-[11px] text-[#F7EFE8]/70">Email Address</div>
                  <div className="font-semibold text-xs truncate">{BRAND.email}</div>
                </div>
              </a>

              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#5A2718]/60 hover:bg-[#F50057] transition-all group"
              >
                <InstagramIcon className="w-4 h-4 text-[#F50057] group-hover:text-white transition-colors" />
                <div>
                  <div className="text-[11px] text-[#F7EFE8]/70">Instagram</div>
                  <div className="font-semibold">{BRAND.instagramHandle}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-[#5A2718] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7EFE8]/60">
          <p>© {new Date().getFullYear()} Hamtunes Cakes & Bakes. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-[#F50057] fill-[#F50057]" /> for 16 years of celebrations across Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
