import { Locale } from "@/types/common";

export const LOCALES: Locale[] = ["az", "en", "ru", "tr"];

export const DEFAULT_LOCALE: Locale = "az";

export const LOCALE_LABELS: Record<Locale, string> = {
  az: "Azərbaycan",
  en: "English",
  ru: "Русский",
  tr: "Türkçe",
};
