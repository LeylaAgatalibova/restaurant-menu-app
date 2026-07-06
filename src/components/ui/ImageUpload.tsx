"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadProductImage, MAX_IMAGE_SIZE_BYTES } from "@/services/image.service";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
};

export default function ImageUpload({ value, onChange, label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("This image is larger than 10 MB. Please choose a smaller photo.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const previewUrl = getOptimizedImageUrl(value);

  return (
    <div>
     <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </label>

      <div className="mt-1.5">
        {previewUrl ? (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
            <Image src={previewUrl} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-neutral-300 hover:text-neutral-500 transition-colors"
          >
            {isUploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={24} />
                <span className="text-xs">Upload image (max 10 MB)</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
