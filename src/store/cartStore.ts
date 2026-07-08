import { create } from "zustand";
import { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  orderNote: string; // one note for the whole order, e.g. "no spicy food"
  addItem: (item: Omit<CartItem, "quantity" | "cartItemId">) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  removeItem: (cartItemId: string) => void;
  setNote: (cartItemId: string, note: string) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
};
// This is a plain in-memory store on purpose. The cart is only a helper
// for the customer to organize their order before telling the waiter -
// there is no checkout, so nothing here needs to survive a page refresh
// or be written to Firestore.
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  orderNote: "",

 addItem: (item) => {
    const cartItemId = `${item.productId}-${item.size ?? "base"}`;
    const existing = get().items.find((i) => i.cartItemId === cartItemId);
    if (existing) {
      get().increaseQuantity(cartItemId);
      return;
    }
    set((state) => ({
      items: [...state.items, { ...item, cartItemId, quantity: 1 }],
    }));
  },

  increaseQuantity: (cartItemId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  },

  decreaseQuantity: (cartItemId) => {
    set((state) => ({
      items: state.items
        .map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    }));
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.cartItemId !== cartItemId),
    }));
  },

  setNote: (cartItemId, note) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, note } : i
      ),
    }));
  },

  setOrderNote: (note) => set({ orderNote: note }),

  clearCart: () => set({ items: [], orderNote: "" }),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
