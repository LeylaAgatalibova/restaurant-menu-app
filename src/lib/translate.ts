import { LocalizedText } from "@/types/common";

// MyMemory is a free, keyless translation API with CORS support - good
// enough for auto-filling admin content so the owner only types once,
// in Azerbaijani. If a request fails (offline, rate-limited, etc.) we
// fall back to copying the original text, so saving never breaks -
// the owner can still go back and correct a translation manually later.
async function translateText(text: string, targetLang: "en" | "ru" | "tr"): Promise<string> {
  if (!text.trim()) return "";

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=az|${targetLang}`
    );
    const data = await response.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text; // fallback: keep original text rather than fail the save
  }
}

// Takes what the admin typed in Azerbaijani and returns a full LocalizedText
// with English, Russian, and Turkish auto-filled. Called right before saving
// any category/product/badge/settings field.
export async function autoFillLocalizedText(azText: string): Promise<LocalizedText> {
  const [en, ru, tr] = await Promise.all([
    translateText(azText, "en"),
    translateText(azText, "ru"),
    translateText(azText, "tr"),
  ]);
  return { az: azText, en, ru, tr };
}
