"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { subscribeToBadges, deleteBadge } from "@/services/badges.service";
import { Badge } from "@/types/product";
import BadgeFormModal from "@/components/admin/BadgeFormModal";

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    return subscribeToBadges(setBadges);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this badge? It will be removed from any products using it.")) return;
    await deleteBadge(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Badges</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Reusable tags like &quot;Spicy&quot; or &quot;Chef&apos;s Pick&quot; you can attach to products.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3.5 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} />
          New Badge
        </button>
      </div>

      {badges.length === 0 ? (
        <p className="text-sm text-neutral-400">No badges yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-2 bg-white border border-neutral-200 rounded-full pl-3 pr-1.5 py-1.5"
            >
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ backgroundColor: `${badge.color}1A`, color: badge.color }}
              >
                {badge.label.az || badge.label.en}
              </span>
              <button
                onClick={() => setEditingBadge(badge)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(badge.id)}
                className="p-1 text-neutral-400 hover:text-red-500"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {(isCreating || editingBadge) && (
        <BadgeFormModal
          badge={editingBadge}
          onClose={() => {
            setEditingBadge(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}
