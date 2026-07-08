"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import { Locale, getLocalizedText } from "@/types/common";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: Product;
  locale: Locale;
  onClose: () => void;
};

export default function ProductModal({ product, locale, onClose }: Props) {
  const t = useTranslations("product");
  const tMenu = useTranslations("menu");
  const addItem = useCartStore((state) => state.addItem);
   const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState(product.sizes?.[0]?.id ?? null);
  const imageUrl = getOptimizedImageUrl(product.imageUrl);
  const name = getLocalizedText(product.name, locale);
  const description = getLocalizedText(product.description, locale);
  const ingredients = getLocalizedText(product.ingredients, locale);
  const selectedSize = product.sizes?.find((s) => s.id === selectedSizeId) ?? null;
  const unitPrice = selectedSize ? selectedSize.price : product.price;

 function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name,
        size: selectedSize?.label,
        price: unitPrice,
        imageUrl: product.imageUrl,
      });
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden rounded-t-2xl">
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
                sizes="500px"
                className="object-contain relative z-10 sm:rounded-t-2xl"
              />
            </>
          ) : null}
     <button
            onClick={onClose}
            aria-label={t("close")}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 hover:bg-white z-20"
          >
            <X size={18} />
          </button>
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-600">
                {tMenu("unavailable")}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-1 mb-2">
            {product.badges.map((badge) => (
              <span
                key={badge.id}
                className="text-[11px] font-medium px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${badge.color}1A`,
                  color: badge.color,
                }}
              >
                {getLocalizedText(badge.label, locale)}
              </span>
            ))}
          </div>

        <h2 className="text-lg font-semibold">{name}</h2>
          <p className="mt-1 text-base font-semibold text-neutral-700">
            {formatPrice(unitPrice)}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">
                {t("selectSize")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`flex items-center justify-between gap-3 border rounded-xl px-3 py-2 text-sm transition-colors ${
                      selectedSizeId === size.id
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <span className="font-medium">{size.label}</span>
                    <span className={selectedSizeId === size.id ? "text-white/80" : "text-neutral-400"}>
                      {formatPrice(size.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {description && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">
                {t("description")}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {ingredients && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-1">
                {t("ingredients")}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {ingredients}
              </p>
            </div>
          )}

          {product.isAvailable && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-neutral-200 rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-neutral-500 hover:text-neutral-900"
                  aria-label="decrease"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-neutral-500 hover:text-neutral-900"
                  aria-label="increase"
                >
                  <Plus size={16} />
                </button>
              </div>

             <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> {t("added")}
                  </>
                ) : (
                  `${t("addToCart")} · ${formatPrice(unitPrice * quantity)}`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
