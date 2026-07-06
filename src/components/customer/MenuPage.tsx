"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Alex_Brush } from "next/font/google";
import { useLocale, useTranslations } from "next-intl";
import { useMenuData } from "@/hooks/useMenuData";
import { Product } from "@/types/product";
import { Locale, getLocalizedText } from "@/types/common";
import { RestaurantSettings } from "@/types/settings";
import { subscribeToRestaurantSettings } from "@/services/settings.service";
import SearchBar from "./SearchBar";
import CategoryTabs from "./CategoryTabs";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";
import LanguageSwitcher from "./LanguageSwitcher";
import Hero from "./Hero";
import Footer from "./Footer";

const alexBrush = Alex_Brush({ subsets: ["latin"], weight: "400" });

export default function MenuPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("menu");
  const { categories, products, isLoading } = useMenuData();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    return subscribeToRestaurantSettings(setSettings);
  }, []);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (query) {
        const name = getLocalizedText(product.name, locale).toLowerCase();
        return name.includes(query);
      }
      if (activeCategoryId) return product.categoryId === activeCategoryId;
      return true;
    });
  }, [products, search, activeCategoryId, locale]);

  const themeVars = {
    "--title-color": settings?.titleColor || "#171717",
    "--product-name-color": settings?.productNameColor || "#171717",
    "--theme-color": settings?.themeColor || "#fafafa",
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </main>
    );
  }

  return (
<main className="min-h-screen pb-28 bg-[var(--theme-color)]" style={themeVars}>
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-[var(--title-color)]">
            <span className={`${alexBrush.className} text-3xl align-middle mr-1`}>
              {settings?.name || "Restaurant"}
            </span>{" "}
            <span className="text-xl font-bold tracking-wide">Menu</span>
          </h1>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <Hero settings={settings} />
      </div>

      <header className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 space-y-3">
          <SearchBar value={search} onChange={setSearch} />
          {!search && (
            <CategoryTabs
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
              locale={locale}
            />
          )}
        </div>
      </header>

<div className="max-w-2xl mx-auto px-4 pt-4">
        {settings?.serviceChargeEnabled && (
          <p className="text-xs text-neutral-400 mb-4 text-center">
            {t("serviceCharge", { percent: settings.serviceChargePercent })}
          </p>
        )}

        {visibleProducts.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-16">{t("noResults")}</p>
        ) : (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <ProductCard product={product} locale={locale} onSelect={setSelectedProduct} priority={index === 0} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer settings={settings} />

      <CartButton onOpen={() => setCartOpen(true)} />
      {selectedProduct && (
        <ProductModal product={selectedProduct} locale={locale} onClose={() => setSelectedProduct(null)} />
      )}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </main>
  );
}