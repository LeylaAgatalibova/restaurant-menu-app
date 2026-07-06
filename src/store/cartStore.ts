import { create } from "zustand";
import { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  orderNote: string; // one note for the whole order, e.g. "no spicy food"
  addItem: (item: Omit<CartItem, "quantity">) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  removeItem: (productId: string) => void;
  setNote: (productId: string, note: string) => void;
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
    const existing = get().items.find((i) => i.productId === item.productId);
    if (existing) {
      get().increaseQuantity(item.productId);
      return;
    }
    set((state) => ({
      items: [...state.items, { ...item, quantity: 1 }],
    }));
  },

  increaseQuantity: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  },

  decreaseQuantity: (productId) => {
    set((state) => ({
      items: state.items
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    }));
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },

  setNote: (productId, note) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, note } : i
      ),
    }));
  },

  setOrderNote: (note) => set({ orderNote: note }),

  clearCart: () => set({ items: [], orderNote: "" }),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
