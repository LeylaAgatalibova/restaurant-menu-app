// Handles product image uploads via Cloudinary's unsigned upload API.
//
// Why unsigned uploads: we have no custom backend server to hold the
// Cloudinary API secret safely, and adding one just for image signing
// would be unnecessary complexity for this MVP. An unsigned upload
// preset (scoped to a single folder, configured in the Cloudinary
// dashboard) is the simplest safe option, and only the authenticated
// admin panel ever calls this function - customers never see it.

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Cloudinary's free plan rejects any single file over 10 MB. We check this
// ourselves before uploading so the admin gets an immediate, friendly
// message instead of a failed network request after waiting for the upload.
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function uploadProductImage(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local."
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      "This image is larger than 10 MB. Please choose a smaller photo or compress it before uploading."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "products");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Image upload failed. Please try again.");
  }

  const data = await response.json();
  // secure_url is the permanent HTTPS link we store on the product document.
  return data.secure_url as string;
}

// Note on deleting old images: Cloudinary deletion requires a signed
// request (needs the API secret), which we deliberately don't expose to
// the browser. For this MVP we accept that replacing/removing a product
// image leaves the old file in Cloudinary's media library rather than
// building a signing backend just to clean it up. You can periodically
// clear unused images from the Cloudinary Media Library UI if needed.
