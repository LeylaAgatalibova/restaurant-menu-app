"use client";

import Image from "next/image";
import { RestaurantSettings } from "@/types/settings";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

type Props = { settings: RestaurantSettings | null };

export default function Hero({ settings }: Props) {
  if (!settings || (!settings.bannerUrl && !settings.logoUrl)) return null;
  const bannerUrl = getOptimizedImageUrl(settings.bannerUrl);
  const logoUrl = getOptimizedImageUrl(settings.logoUrl);

function scrollToDetails() {
    const element = document.getElementById("wifi-section") || document.querySelector("footer");
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
   <div className="relative mb-6 animate-fade-in">
      <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-neutral-800">
        {bannerUrl && <Image src={bannerUrl} alt="" fill className="object-cover" />}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/20" />
        <button
          type="button"
          onClick={scrollToDetails}
          className="absolute bottom-3 left-3 z-10 text-xs font-medium tracking-wide text-white/90 bg-white/10 border border-white/30 backdrop-blur-md rounded-full px-3 py-1.5 hover:bg-white/20 hover:text-white transition-colors"
        >
          Info
        </button>
        {logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full border border-neutral-200/50 shadow-md overflow-hidden flex items-center justify-center bg-transparent backdrop-blur-md">
              <Image src={logoUrl} alt="" fill className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}