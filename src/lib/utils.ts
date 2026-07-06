// Formats a raw number into a currency string, e.g. 12.5 -> "12.50 ₼"
// Kept as a plain function rather than a full i18n money library because
// this MVP only ever displays one currency (Azerbaijani Manat).
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} ₼`;
}
