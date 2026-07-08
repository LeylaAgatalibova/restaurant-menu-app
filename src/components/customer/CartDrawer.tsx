"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { subscribeToRestaurantSettings } from "@/services/settings.service";
import { RestaurantSettings } from "@/types/settings";

type Props = {
  onClose: () => void;
};

export default function CartDrawer({ onClose }: Props) {
  const t = useTranslations("cart");
  const items = useCartStore((state) => state.items);
  const orderNote = useCartStore((state) => state.orderNote);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const setNote = useCartStore((state) => state.setNote);
  const setOrderNote = useCartStore((state) => state.setOrderNote);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    return subscribeToRestaurantSettings(setSettings);
  }, []);

  const subtotal = totalPrice;
  const serviceChargeEnabled = settings?.serviceChargeEnabled ?? false;
  const serviceChargePercent = settings?.serviceChargePercent ?? 0;
  const serviceFee = serviceChargeEnabled ? subtotal * (serviceChargePercent / 100) : 0;
  const grandTotal = subtotal + serviceFee;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="font-semibold">{t("title")}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100"
            aria-label={t("title")}
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <p className="font-medium">{t("empty")}</p>
            <p className="text-sm text-neutral-400 mt-1">{t("emptyHint")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => {
                const imageUrl = getOptimizedImageUrl(item.imageUrl);
                return (
                  <div key={item.cartItemId} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg bg-neutral-100 shrink-0 overflow-hidden">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                       <h3 className="text-sm font-medium leading-snug">
                          {item.name}
                          {item.size && (
                            <span className="text-neutral-400 font-normal"> ({item.size})</span>
                          )}
                        </h3>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-neutral-300 hover:text-neutral-500 shrink-0"
                          aria-label="remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-sm text-neutral-500 mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      <input
                        type="text"
                        value={item.note ?? ""}
                        onChange={(e) => setNote(item.cartItemId, e.target.value)}
                        placeholder={t("itemNotePlaceholder")}
                        className="mt-1.5 w-full text-xs border border-neutral-200 rounded-lg px-2 py-1 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300"
                      />

                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center border border-neutral-200 rounded-full">
                    <button
                            onClick={() => decreaseQuantity(item.cartItemId)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900"
                            aria-label="decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.cartItemId)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900"
                            aria-label="increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-xs font-semibold ml-auto">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {t("orderNote")}
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={t("orderNotePlaceholder")}
                  rows={2}
                  className="mt-1 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100">
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {serviceChargeEnabled && (
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <span>
                      {t("serviceCharge")} ({serviceChargePercent}%)
                    </span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium">{t("grandTotal")}</span>
                  <span className="text-lg font-semibold">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 mb-3">{t("waiterHint")}</p>
              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-neutral-400 hover:text-neutral-600 py-2"
              >
                {t("clear")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
