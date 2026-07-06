"use client";

import { useEffect, useState } from "react";
import { subscribeToCategories } from "@/services/categories.service";
import { subscribeToProducts } from "@/services/products.service";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

type MenuData = {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
};

// Subscribes to Firestore in real time so any change made in the admin
// panel (new dish, price update, availability toggle, soft delete) shows
// up on the customer menu instantly, with no refresh needed.
export function useMenuData(): MenuData {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeCategories = subscribeToCategories((data) => {
      setCategories(data);
      setCategoriesLoaded(true);
    });
    const unsubscribeProducts = subscribeToProducts((data) => {
      setProducts(data);
      setProductsLoaded(true);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  return {
    categories,
    products,
    isLoading: !categoriesLoaded || !productsLoaded,
  };
}
