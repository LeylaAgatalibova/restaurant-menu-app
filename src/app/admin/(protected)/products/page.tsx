"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  getAllProducts,
  deleteProduct,
  toggleAvailability,
} from "@/services/products.service";
import { getAllCategories } from "@/services/categories.service";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { formatPrice } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import ProductFormModal from "@/components/admin/ProductFormModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function reload() {
    const [productsData, categoriesData] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData.filter((c) => c.isActive));
    setIsLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const visibleProducts = useMemo(() => {
    if (categoryFilter === "all") return products;
    return products.filter((p) => p.categoryId === categoryFilter);
  }, [products, categoryFilter]);

  function categoryName(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name.az || category.name.en : "—";
  }

async function handleDelete(id: string) {
    if (!confirm("Permanently delete this product? This cannot be undone.")) return;
    await deleteProduct(id);
    reload();
  }

  async function handleToggleAvailability(product: Product) {
    await toggleAvailability(product.id, !product.isAvailable);
    reload();
  }

  function handleModalClose() {
    setEditingProduct(null);
    setIsCreating(false);
    reload();
  }

  const nextOrder = products.length ? Math.max(...products.map((p) => p.order)) + 1 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => setIsCreating(true)}
          disabled={categories.length === 0}
          className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          New Product
        </button>
      </div>

      {categories.length === 0 && !isLoading && (
        <p className="text-sm text-amber-600 mb-4">
          Create a category first before adding products.
        </p>
      )}

      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${
              categoryFilter === "all"
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap ${
                categoryFilter === category.id
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600"
              }`}
            >
              {category.name.az || category.name.en}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-sm text-neutral-400">No products in this category yet.</p>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
          {visibleProducts.map((product) => {
            const imageUrl = getOptimizedImageUrl(product.imageUrl);
            return (
              <div
                key={product.id}
                className={`flex flex-wrap items-center gap-3 px-4 py-3 ${
                  !product.isActive ? "opacity-50" : ""
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg bg-neutral-100 shrink-0 overflow-hidden">
                  {imageUrl && (
                    <Image src={imageUrl} alt="" fill sizes="48px" className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">
                      {product.name.az || product.name.en}
                    </p>
                    {product.isFeatured && (
                      <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {categoryName(product.categoryId)} · {formatPrice(product.price)}
                  </p>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0">
                  <input
                    type="checkbox"
                    checked={product.isAvailable}
                    onChange={() => handleToggleAvailability(product)}
                    className="rounded"
                  />
                  Available
                </label>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="p-2 text-neutral-400 hover:text-neutral-900"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
            <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-neutral-400 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

   {(isCreating || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          nextOrder={nextOrder}
          defaultCategoryId={categoryFilter !== "all" ? categoryFilter : undefined}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
