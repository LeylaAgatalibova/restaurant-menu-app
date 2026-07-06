// Rewrites a Cloudinary delivery URL to request automatic format and
// quality optimization. This is what actually saves storage/bandwidth
// credit on the free plan - Cloudinary will serve WebP/AVIF to browsers
// that support it and compress intelligently, without us managing
// multiple image sizes ourselves.
//
// Example:
//   https://res.cloudinary.com/demo/image/upload/v1/products/pizza.jpg
//   becomes
//   https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1/products/pizza.jpg
//
// Use this wherever a product image URL is rendered (customer menu cards,
// admin previews, product detail view) - never store the optimized URL
// in Firestore, only the original `secure_url` from the upload response.
// That way we can change the transformation later without re-uploading
// every image.
export function getOptimizedImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (!url.includes("res.cloudinary.com")) return url; // not a Cloudinary URL, leave untouched
  if (url.includes("/upload/f_auto")) return url; // already optimized, avoid double-inserting

  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}
