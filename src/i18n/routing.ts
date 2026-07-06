import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@/constants/languages";

// This is the one place that defines which locales exist and which one
// is used as a fallback. The middleware (proxy.ts) and the navigation
// helpers below both read from this so they can never drift out of sync.
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});
