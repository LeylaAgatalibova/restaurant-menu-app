export type CartItem = {
  productId: string;
  name: string; // resolved to the active locale at the time it was added
  price: number;
  quantity: number;
  imageUrl: string | null;
  note?: string; // optional per-item note, e.g. "no onions"
};
