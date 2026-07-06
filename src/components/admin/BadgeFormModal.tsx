"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/types/product";
import { LocalizedText } from "@/types/common";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { createBadge, updateBadge } from "@/services/badges.service";
import { autoFillLocalizedText } from "@/lib/translate";

type Props = {
  badge: Badge | null;
  onClose: () => void;
};

const EMPTY_LABEL: LocalizedText = { az: "", en: "", ru: "", tr: "" };
const PRESET_COLORS = ["#DC2626", "#059669", "#D97706", "#7C3AED", "#2563EB", "#DB2777"];

export default function BadgeFormModal({ badge, onClose }: Props) {
  const [label, setLabel] = useState<LocalizedText>(badge?.label ?? EMPTY_LABEL);
  const [color, setColor] = useState(badge?.color ?? PRESET_COLORS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.az.trim()) {
      setError("At least the Azerbaijani label is required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const translatedLabel = await autoFillLocalizedText(label.az);
      if (badge) {
        await updateBadge(badge.id, { label: translatedLabel, color });
      } else {
        await createBadge({ label: translatedLabel, color });
      }
      onClose();
    } catch {
      setError("Something went wrong saving this badge. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{badge ? "Edit Badge" : "New Badge"}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <LocalizedInput label="Label" value={label} onChange={setLabel} required />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Color
            </label>
            <div className="mt-1.5 flex gap-2 flex-wrap">
              {PRESET_COLORS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setColor(preset)}
                  className={`w-8 h-8 rounded-full ring-offset-2 transition-shadow ${
                    color === preset ? "ring-2 ring-neutral-900" : ""
                  }`}
                  style={{ backgroundColor: preset }}
                  aria-label={preset}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400">Preview:</span>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              {label.az || "Badge"}
            </span>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-neutral-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
