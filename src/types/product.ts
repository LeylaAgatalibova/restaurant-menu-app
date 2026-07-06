import { LocalizedText } from "./common";

export type Badge = {
  id: string;
  label: LocalizedText;
  color: string; // Tailwind-friendly hex or class token, e.g. "#E11D48"
};

export type Product = {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  ingredients: LocalizedText; // stored as one translated block of text
  price: number; // stored in the smallest sensible unit for the currency, e.g. AZN as a decimal
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
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  badges: Badge[];
  order: number;
};
