"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Category } from "@/types/category";
import { Locale, getLocalizedText } from "@/types/common";

type Props = {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  locale: Locale;
};

export default function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
  locale,
}: Props) {
  const t = useTranslations("menu");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Desktop-only nudge buttons - on mobile, native touch/swipe scrolling
  // on the row below already works via overflow-x-auto.
  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        onClick={() => scrollBy(-160)}
        aria-label="Scroll categories left"
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-500 hover:text-neutral-900"
      >
        <ChevronLeft size={14} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:px-9 scroll-smooth"
      >
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategoryId === null
              ? "bg-neutral-900 text-white"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
          }`}
        >
          {t("all")}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategoryId === category.id
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {getLocalizedText(category.name, locale)}
          </button>
        ))}
      </div>

      <button
        onClick={() => scrollBy(160)}
        aria-label="Scroll categories right"
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm text-neutral-500 hover:text-neutral-900"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
