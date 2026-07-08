import { LocalizedText } from "./common";

export type Badge = {
  id: string;
  label: LocalizedText;
  color: string; // Tailwind-friendly hex or class token, e.g. "#E11D48"
};

export type ProductSize = {
  id: string;
  label: string; // e.g. "S", "M", "L"
  price: number;
};

export type Product = {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  ingredients: LocalizedText; // stored as one translated block of text
  price: number; // base/single price, used when sizes is empty
  sizes: ProductSize[]; // if non-empty, overrides price in customer UI
  imageUrl: string | null; // Firebase Storage download URL
  isAvailable: boolean; // "86'd" toggle - hide from menu without deleting
  isFeatured: boolean;
  badges: Badge[];
  isActive: boolean; // soft delete flag
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type ProductInput = {
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  ingredients: LocalizedText;
  price: number;
  sizes: ProductSize[];
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  badges: Badge[];
  order: number;
};
