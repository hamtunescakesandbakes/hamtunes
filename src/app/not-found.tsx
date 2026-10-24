import React from "react";
import Link from "next/link";
import { Cake, ArrowLeft, Home, Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FFF9F5]">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E8DDD7] text-center shadow-lg space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center mx-auto">
          <Cake className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F50057]">
            Page Not Found
          </span>
          <h1 className="font-serif font-black text-4xl text-[#351207]">
            404
          </h1>
          <p className="text-sm text-[#6F625C] leading-relaxed">
            The page you are looking for might have been moved or is currently baking in our oven!
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold text-xs sm:text-sm py-3 rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/cakes"
              className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-[#E8DDD7] text-xs font-semibold text-[#351207] hover:bg-[#F7EFE8] transition-colors"
            >
              <Cake className="w-3.5 h-3.5 text-[#F50057]" />
              <span>Explore Cakes</span>
            </Link>

            <Link
              href="/bakes-and-small-chops"
              className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-[#E8DDD7] text-xs font-semibold text-[#351207] hover:bg-[#F7EFE8] transition-colors"
            >
              <Coffee className="w-3.5 h-3.5 text-[#F50057]" />
              <span>Explore Bakes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
