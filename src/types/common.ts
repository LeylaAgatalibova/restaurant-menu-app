// Every field that a customer can see in multiple languages uses this shape.
// Example: { az: "Plov", en: "Plov", ru: "Плов", tr: "Plov" }
export type Locale = "az" | "en" | "ru" | "tr";

export type LocalizedText = {
  az: string;
  en: string;
  ru: string;
  tr: string;
};

// Helper type: pick the right language string safely, falling back to English
// if a translation was never filled in by the admin.
// export function getLocalizedText(text: LocalizedText, locale: Locale): string {
//   return text[locale] || text.en || "";
// }
export function getLocalizedText(text: LocalizedText | undefined | null, locale: Locale): string {
  if (!text) return "";
  // Fall back through az -> en -> ru -> tr -> "" so a missing/partial
  // translation object can never crash the render.
  return text[locale] || text.az || text.en || text.ru || text.tr || "";
}