"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Category } from "@/types/category";
import { LocalizedText } from "@/types/common";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { createCategory, updateCategory } from "@/services/categories.service";
import { autoFillLocalizedText } from "@/lib/translate";

type Props = {
  category: Category | null; // null = creating a new category
  nextOrder: number;
  onClose: () => void;
};

const EMPTY_NAME: LocalizedText = { az: "", en: "", ru: "", tr: "" };

export default function CategoryFormModal({ category, nextOrder, onClose }: Props) {
  const [name, setName] = useState<LocalizedText>(category?.name ?? EMPTY_NAME);
  const [order, setOrder] = useState(category?.order ?? nextOrder);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.az.trim()) {
      setError("At least the Azerbaijani name is required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const translatedName = await autoFillLocalizedText(name.az);
      if (category) {
        await updateCategory(category.id, { name: translatedName, order });
      } else {
        await createCategory({ name: translatedName, order });
      }
      onClose();
    } catch {
      setError("Something went wrong saving this category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {category ? "Edit Category" : "New Category"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <LocalizedInput label="Name" value={name} onChange={setName} required />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="mt-1.5 w-24 text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400"
            />
            <p className="mt-1 text-xs text-neutral-400">
              Lower numbers appear first on the menu.
            </p>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
