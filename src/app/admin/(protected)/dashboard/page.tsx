"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getAllCategories } from "@/services/categories.service";
import { getAllProducts } from "@/services/products.service";
import { DEFAULT_LOCALE } from "@/constants/languages";

export default function DashboardPage() {
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [featuredCount, setFeaturedCount] = useState<number | null>(null);
  const [menuUrl, setMenuUrl] = useState("");

  useEffect(() => {
    // window is only available client-side, so we build the QR target
    // URL after mount rather than hardcoding a domain.
    setMenuUrl(`${window.location.origin}/${DEFAULT_LOCALE}`);

    async function loadStats() {
      const [categories, products] = await Promise.all([
        getAllCategories(),
        getAllProducts(),
      ]);
      const activeCategories = categories.filter((c) => c.isActive);
      const activeProducts = products.filter((p) => p.isActive);
      setCategoryCount(activeCategories.length);
      setProductCount(activeProducts.length);
      setFeaturedCount(activeProducts.filter((p) => p.isFeatured).length);
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Categories" value={categoryCount} />
        <StatCard label="Products" value={productCount} />
        <StatCard label="Featured" value={featuredCount} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-sm">
        <h2 className="text-sm font-semibold mb-1">Your Menu QR Code</h2>
        <p className="text-xs text-neutral-500 mb-4">
          Print this and place it on tables - scanning it opens your live
          menu.
        </p>
        {menuUrl && (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white border border-neutral-100 rounded-xl">
              <QRCodeSVG value={menuUrl} size={160} />
            </div>
            <p className="text-xs text-neutral-400 break-all text-center">
              {menuUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value ?? "—"}</p>
    </div>
  );
}
