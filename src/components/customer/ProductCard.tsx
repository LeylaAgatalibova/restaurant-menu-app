"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import { Locale, getLocalizedText } from "@/types/common";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: Product;
  locale: Locale;
  onSelect: (product: Product) => void;
  priority?: boolean;
};

export default function ProductCard({ product, locale, onSelect, priority = false }: Props) {
  const t = useTranslations("menu");
  const addItem = useCartStore((state) => state.addItem);
  const imageUrl = getOptimizedImageUrl(product.imageUrl);
  const name = getLocalizedText(product.name, locale);
  const secondaryText =
    getLocalizedText(product.description, locale) ||
    getLocalizedText(product.ingredients, locale);
  const defaultSize = product.sizes?.[0];
  const displayPrice = defaultSize ? defaultSize.price : product.price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addItem({
      productId: product.id,
      name,
      size: defaultSize?.label,
      price: displayPrice,
      imageUrl: product.imageUrl,
    });
  }

  return (
    <div
      onClick={() => product.isAvailable && onSelect(product)}
      role="button"
      tabIndex={product.isAvailable ? 0 : -1}
      data-disabled={!product.isAvailable}
      className="w-full text-left bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all data-[disabled=true]:opacity-60 data-[disabled=true]:pointer-events-none flex flex-row sm:flex-col cursor-pointer"
    >
      {/* Image container with blur background effect */}
      <div className="relative order-2 sm:order-1 w-24 h-24 sm:w-full sm:h-auto sm:aspect-[4/3] bg-neutral-900 shrink-0 overflow-hidden rounded-r-2xl sm:rounded-t-2xl sm:rounded-r-none">
        {imageUrl ? (
          <>
            {/* Blurred Background Image */}
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover blur-xl opacity-40 scale-110"
              priority={false}
            />
            {/* Clean Foreground Image */}
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 96px, (max-width: 768px) 50vw, 300px"
              className="object-contain relative z-10"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">
            No image
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute top-1.5 left-1.5 bg-amber-400 text-amber-950 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {t("featured")}
          </span>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[10px] font-medium text-neutral-600 text-center px-1">
              {t("unavailable")}
            </span>
          </div>
        )}

        {product.isAvailable && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Quick add to cart"
            className="absolute bottom-1.5 right-1.5 z-20 bg-neutral-900 text-white rounded-full p-1.5 shadow-md hover:bg-neutral-700 active:scale-90 transition-all"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="order-1 sm:order-2 p-3 flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {product.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {product.badges.map((badge) => (
                <span
                  key={badge.id}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${badge.color}1A`,
                    color: badge.color,
                  }}
                >
                  {getLocalizedText(badge.label, locale)}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-[var(--product-name-color)]">{name}</h3>
          {secondaryText && (
            <p className="mt-0.5 text-xs text-neutral-400 line-clamp-2 sm:hidden">
              {secondaryText}
            </p>
          )}
        </div>
        <p className="mt-1 text-sm font-semibold">{formatPrice(displayPrice)}</p>
      </div>
    </div>
  );
}