"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getAllCategories,
  deleteCategory,
} from "@/services/categories.service";
import { Category } from "@/types/category";
import CategoryFormModal from "@/components/admin/CategoryFormModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function reload() {
    const data = await getAllCategories();
    setCategories(data);
    setIsLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

async function handleDelete(id: string) {
    if (!confirm("Permanently delete this category and ALL its products? This cannot be undone.")) return;
    await deleteCategory(id);
    reload();
  }
  function handleModalClose() {
    setEditingCategory(null);
    setIsCreating(false);
    reload();
  }

  const nextOrder = categories.length
    ? Math.max(...categories.map((c) => c.order)) + 1
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Categories</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No categories yet. Create your first one to get started.
        </p>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 ${
                !category.isActive ? "opacity-50" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{category.name.az || category.name.en}</p>
                <p className="text-xs text-neutral-400">Order: {category.order}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingCategory(category)}
                  className="p-2 text-neutral-400 hover:text-neutral-900"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
               <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-neutral-400 hover:text-red-500"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          nextOrder={nextOrder}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
