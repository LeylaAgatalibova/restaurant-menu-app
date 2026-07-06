"use client";

import { Camera, Music2, MessageCircle, MapPin, Briefcase, ThumbsUp, Clock, Wifi } from "lucide-react";import { useTranslations } from "next-intl";
import { RestaurantSettings } from "@/types/settings";

type Props = { settings: RestaurantSettings | null };

export default function Footer({ settings }: Props) {
  const t = useTranslations("footer");
  const address = settings?.address ?? "";
  const mapEmbedUrl = settings?.mapEmbedUrl ?? "";
  const openingTime = settings?.openingTime ?? "";
  const closingTime = settings?.closingTime ?? "";
const hasWorkingHours = !!(openingTime && closingTime);
  const hasWifi = !!(settings?.showWifi && settings?.wifiName);
  const socials = settings?.socials;
  const hasSocials = !!(
    socials &&
    (socials.instagram || socials.tiktok || socials.whatsapp || socials.linkedin || socials.facebook)
  );
  const hasContent = address || mapEmbedUrl || hasSocials || hasWorkingHours || hasWifi;

   return (
    <footer id="wifi-section" className="max-w-2xl mx-auto px-4 pb-8 pt-6 mt-4 border-t border-neutral-100 animate-fade-in">
     {hasContent && (
        <>
          {hasWifi && (
            <div className="mb-4 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white px-4 py-3.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                <Wifi size={14} className="shrink-0" />
                {t("wifiTitle")}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{t("wifiNetwork")}</span>
                <span className="font-medium text-neutral-800">{settings?.wifiName}</span>
              </div>
              {settings?.wifiPassword && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-neutral-400">{t("wifiPassword")}</span>
                  <span className="font-mono tracking-wide text-neutral-800">{settings.wifiPassword}</span>
                </div>
              )}
            </div>
          )}
          {hasWorkingHours && (
            <p className="flex items-center gap-1.5 text-sm text-neutral-500 mb-3">
              <Clock size={16} className="shrink-0" />
              {t("workingHours")}: {openingTime} – {closingTime}
            </p>
          )}
          {mapEmbedUrl && (
            <div className="rounded-2xl overflow-hidden mb-4 aspect-[16/9]">
              <iframe src={mapEmbedUrl} className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
          {address && (
            <p className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
              <MapPin size={16} className="shrink-0" />
              {address}
            </p>
          )}
          {hasSocials && socials && (
            <div className="flex items-center gap-3 mb-6">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300">
                  <Camera size={18} />
                </a>
              )}
              {socials.tiktok && (
                <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                  className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300">
                  <Music2 size={18} />
                </a>
              )}
              {socials.whatsapp && (
                <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300">
                  <MessageCircle size={18} />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300">
                  <Briefcase size={18} />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="p-2.5 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300">
                  <ThumbsUp size={18} />
                </a>
              )}
            </div>
          )}
        </>
      )}
      <p className="text-center text-xs text-neutral-400">
       ©All rights reserved. LY_Technologies
      </p>
    </footer>
  );
}