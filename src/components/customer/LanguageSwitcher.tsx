"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, LOCALE_LABELS } from "@/constants/languages";
import { Locale } from "@/types/common";

// Switches locale while staying on the exact same page - important since
// the customer might be mid-search or have a product modal open.
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 bg-white rounded-full border border-neutral-200 p-1">
      {LOCALES.map((code) => (
        <button
          key={code}
          onClick={() => router.replace(pathname, { locale: code })}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
            locale === code
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
          aria-label={LOCALE_LABELS[code]}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
