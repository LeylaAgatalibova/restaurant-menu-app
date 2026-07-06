import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Category, CategoryInput } from "@/types/category";

const CATEGORIES_COLLECTION = "categories";
const PRODUCTS_COLLECTION = "products";

// Converts a raw Firestore document into our typed Category object.
// Keeping this conversion in one place means if Firestore's shape ever
// changes, we only fix it here - not in every component that reads it.
function mapCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: data.name as Category["name"],
    order: data.order as number,
    isActive: data.isActive as boolean,
    createdAt: data.createdAt as number,
    updatedAt: data.updatedAt as number,
  };
}

// Real-time listener used on the customer menu so changes made in the
// admin panel appear instantly without a page refresh.
export function subscribeToCategories(
  onChange: (categories: Category[]) => void
) {
  const q = query(
    collection(db, CATEGORIES_COLLECTION),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map((d) => mapCategory(d.id, d.data()));
    onChange(categories);
  });
}

// One-time fetch used in the admin panel, where we also want to see
// soft-deleted categories so the owner could restore them later if needed.
export async function getAllCategories(): Promise<Category[]> {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapCategory(d.id, d.data()));
}

export async function createCategory(input: CategoryInput): Promise<string> {
  const now = Date.now();
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...input,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<void> {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), {
    ...input,
    updatedAt: Date.now(),
  });
}
// Hard delete: permanently removes the category AND every product that
// belongs to it, atomically via a batch. No soft-delete, no restore -
// once this runs, nothing referencing this category is left behind.
export async function deleteCategory(id: string): Promise<void> {
  const productsSnapshot = await getDocs(
    query(collection(db, PRODUCTS_COLLECTION), where("categoryId", "==", id))
  );

  const batch = writeBatch(db);
  productsSnapshot.docs.forEach((productDoc) => batch.delete(productDoc.ref));
  batch.delete(doc(db, CATEGORIES_COLLECTION, id));

  await batch.commit();
}