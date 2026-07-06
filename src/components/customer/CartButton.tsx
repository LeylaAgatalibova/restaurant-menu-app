"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

type Props = {
  onOpen: () => void;
};

export default function CartButton({ onOpen }: Props) {
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const t = useTranslations("cart");

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center">
      <button
        onClick={onOpen}
        className="w-full max-w-md bg-neutral-900 text-white rounded-full py-3.5 px-5 flex items-center justify-between shadow-lg hover:bg-neutral-800 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <ShoppingBag size={18} />
          {t("viewCart")} · {totalItems}
        </span>
        <span className="text-sm font-semibold">{formatPrice(totalPrice)}</span>
      </button>
    </div>
  );
}
