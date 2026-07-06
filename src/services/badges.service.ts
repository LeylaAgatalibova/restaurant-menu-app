import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Badge } from "@/types/product";

const BADGES_COLLECTION = "badges";

// Badges are simple reusable tags (e.g. "Spicy", "Vegan", "Chef's Pick")
// that get attached to products. Unlike categories/products, we hard-delete
// badges rather than soft-delete: a badge carries no order history or
// customer-facing identity worth preserving, so soft-delete here would add
// complexity without real benefit.
export function subscribeToBadges(onChange: (badges: Badge[]) => void) {
  const q = query(collection(db, BADGES_COLLECTION), orderBy("label.en", "asc"));
  return onSnapshot(q, (snapshot) => {
    const badges = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Badge, "id">),
    }));
    onChange(badges);
  });
}

export async function createBadge(input: Omit<Badge, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, BADGES_COLLECTION), input);
  return docRef.id;
}

export async function updateBadge(
  id: string,
  input: Partial<Omit<Badge, "id">>
): Promise<void> {
  await updateDoc(doc(db, BADGES_COLLECTION, id), input);
}

export async function deleteBadge(id: string): Promise<void> {
  await deleteDoc(doc(db, BADGES_COLLECTION, id));
}
