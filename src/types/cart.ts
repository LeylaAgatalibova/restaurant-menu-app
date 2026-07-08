export type CartItem = {
  cartItemId: string; // productId + size, unique per cart line
  productId: string;
  name: string; // resolved to the active locale at the time it was added
  size?: string; // selected size label, e.g. "L" - omitted if no sizes
  price: number;
  quantity: number;
  imageUrl: string | null;
  note?: string; // optional per-item note, e.g. "no onions"
};