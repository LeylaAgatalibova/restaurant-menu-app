"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Product, Badge } from "@/types/product";
import { Category } from "@/types/category";
import { LocalizedText } from "@/types/common";
import LocalizedInput from "@/components/ui/LocalizedInput";
import ImageUpload from "@/components/ui/ImageUpload";
import { subscribeToBadges } from "@/services/badges.service";
import { createProduct, updateProduct } from "@/services/products.service";

type Props = {
  product: Product | null; // null = creating a new product
  categories: Category[];
  nextOrder: number;
  defaultCategoryId?: string; // category tab active in the admin list when "New Product" was clicked
  onClose: () => void;
};
const EMPTY_TEXT: LocalizedText = { az: "", en: "", ru: "", tr: "" };

// Heuristic: a product was saved in multi-language mode if any translated
// field actually differs from the Azerbaijani value. Used to restore the
// checkbox state correctly when editing an existing product.
// function detectMultiLang(product: Product | null): boolean {
//   if (!product) return false;
//   return (
//     product.name.en !== product.name.az ||
//     product.name.ru !== product.name.az ||
//     product.name.tr !== product.name.az ||
//     product.description.en !== product.description.az ||
//     product.description.ru !== product.description.az ||
//     product.description.tr !== product.description.az
//   );
// }
function detectMultiLang(product: Product | null): boolean {
  if (!product) return false;
  return (
    product.name.en !== product.name.az ||
    product.name.ru !== product.name.az ||
    product.name.tr !== product.name.az
  );
}

export default function ProductFormModal({
  product,
  categories,
  nextOrder,
  defaultCategoryId,
  onClose,
}: Props) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  // Priority: editing an existing product keeps its own category; otherwise
  // fall back to whichever category tab was active in the admin list; only
  // fall back to the very first category if nothing else is available.
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? ""
  );
  // const [isMultiLang, setIsMultiLang] = useState<boolean>(() => detectMultiLang(product));
  // const [name, setName] = useState<LocalizedText>(product?.name ?? EMPTY_TEXT);
  // const [description, setDescription] = useState<LocalizedText>(
  //   product?.description ?? EMPTY_TEXT
  // );
  // const [ingredients, setIngredients] = useState<LocalizedText>(
  //   product?.ingredients ?? EMPTY_TEXT
  // );
  const [isMultiLang, setIsMultiLang] = useState<boolean>(() => detectMultiLang(product));
  const [name, setName] = useState<LocalizedText>(product?.name ?? EMPTY_TEXT);
  // Tərkib üçün: adminin seçdiyi dil və yazdığı tək mətn stateləri
  const [ingLang, setIngLang] = useState<keyof LocalizedText>("az");
  const [ingText, setIngText] = useState<string>(product?.ingredients?.az ?? "");
  
  const [price, setPrice] = useState(product?.price ?? 0);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>(
    product?.badges.map((b) => b.id) ?? []
  );
  const [order, setOrder] = useState(product?.order ?? nextOrder);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToBadges(setAllBadges);
  }, []);

  function toggleBadge(id: string) {
    setSelectedBadgeIds((current) =>
      current.includes(id) ? current.filter((b) => b !== id) : [...current, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.az.trim()) {
      setError("At least the Azerbaijani name is required.");
      return;
    }
    if (!categoryId) {
      setError("Please choose a category.");
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const selectedBadges = allBadges.filter((b) => selectedBadgeIds.includes(b.id));

    // Single-language mode: copy the one value the admin typed into all
    // three locale keys so downstream/customer-facing components (which
    // always read name.en, name.ru, etc.) never see an empty string.
    // Multi-language mode: trust the distinct values already in state.
    // const finalName: LocalizedText = isMultiLang
    //   ? name
    //   : { az: name.az, en: name.az, ru: name.az, tr: name.az };
    // const finalDescription: LocalizedText = isMultiLang
    //   ? description
    //   : { az: description.az, en: description.az, ru: description.az, tr: description.az };
    // const finalIngredients: LocalizedText = isMultiLang
    //   ? ingredients
    //   : { az: ingredients.az, en: ingredients.az, ru: ingredients.az, tr: ingredients.az };

    // const input = {
    //   categoryId,
    //   name: finalName,
    //   description: finalDescription,
    //   ingredients: finalIngredients,

    setIsSaving(true);
    setError(null);

    // Adı çoxaltma və ya fərqli saxlama məntiqi (Admin hansı dildə yazsa, single modda hamısına o kopyalanır)
    const activeNameSource = name.az || name.en || name.ru || name.tr || "";
    const finalName: LocalizedText = isMultiLang
      ? name
      : { az: activeNameSource, en: activeNameSource, ru: activeNameSource, tr: activeNameSource };

    // Tərkibləri avtomatik tərcümə edən funksiya (MyMemory API və ya sadə fallback)
    const finalIngredients: LocalizedText = { ...EMPTY_TEXT };
    finalIngredients[ingLang] = ingText;

    const locales: (keyof LocalizedText)[] = ["az", "en", "ru", "tr"];
    for (const lang of locales) {
      if (lang !== ingLang) {
        try {
          // Əgər src/lib/translate daxilində real funksiyan varsa, bura bağlaya bilərsən.
          // Yoxdursa, aşağıdakı sətir tərcümə xətası vermədən mətni kopyalayır/hazırlayır.
          const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(ingText)}&langpair=${ingLang}|${lang}`);
          const data = await res.json();
          finalIngredients[lang] = data.responseData?.translatedText || ingText;
        } catch {
          finalIngredients[lang] = ingText; // Xəta olarsa, yazdığı dildəki mətni kopyala
        }
      }
    }

    const input = {
      categoryId,
      name: finalName,
      description: product?.description ?? EMPTY_TEXT,
      ingredients: finalIngredients,
      price,
      imageUrl,
      isAvailable,
      isFeatured,
      badges: selectedBadges,
      order,
    };

    try {
      if (product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      onClose();
    } catch {
      setError("Something went wrong saving this product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400 bg-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name.az || category.name.en}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={isMultiLang}
              onChange={(e) => setIsMultiLang(e.target.checked)}
              className="rounded"
            />
            Çoxlu dil seçimi / Multi-language input
          </label>

          {/* <LocalizedInput
            label="Name"
            value={name}
            onChange={setName}
            required
            isMultiLang={isMultiLang}
          />
          <LocalizedInput
            label="Description"
            value={description}
            onChange={setDescription}
            multiline
            isMultiLang={isMultiLang}
          />
          <LocalizedInput
            label="Ingredients"
            value={ingredients}
            onChange={setIngredients}
            multiline
            isMultiLang={isMultiLang}
          /> */}

          <LocalizedInput
            label="Name"
            value={name}
            onChange={setName}
            required
            isMultiLang={isMultiLang}
          />

          {/* Yeni Dropdown və Tək sahəli Tərkib bölməsi */}
          <div className="border border-neutral-100 p-4 rounded-xl bg-neutral-50/50 space-y-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Tərkibi hansı dildə yazmaq istəyirsiz?
              </label>
              <span className="text-[11px] text-neutral-400 italic">
                (Digər dillərə isə avtomatik sayt tərəfindən tərcümə olunacaq)
              </span>
              <select
                value={ingLang}
                onChange={(e) => setIngLang(e.target.value as keyof LocalizedText)}
                className="mt-1 text-sm border border-neutral-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
              >
                <option value="az">Azerbaijani</option>
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="tr">Turkish</option>
              </select>
            </div>

            <div className="mt-2">
              <textarea
                value={ingText}
                onChange={(e) => setIngText(e.target.value)}
                rows={3}
                placeholder="Məhsulun tərkibini daxil edin..."
                className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400 resize-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Price (₼)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1.5 w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-neutral-400"
            />
          </div>

          {allBadges.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Badges
              </label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {allBadges.map((badge) => {
                  const selected = selectedBadgeIds.includes(badge.id);
                  return (
                    <button
                      type="button"
                      key={badge.id}
                      onClick={() => toggleBadge(badge.id)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors"
                      style={
                        selected
                          ? { backgroundColor: badge.color, color: "white", borderColor: badge.color }
                          : { borderColor: "#e5e5e5", color: "#737373" }
                      }
                    >
                      {badge.label.az || badge.label.en}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded"
              />
              Featured
            </label>
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
