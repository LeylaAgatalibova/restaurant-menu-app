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
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product, ProductInput } from "@/types/product";

const PRODUCTS_COLLECTION = "products";

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    categoryId: data.categoryId as string,
    name: data.name as Product["name"],
    description: data.description as Product["description"],
    ingredients: data.ingredients as Product["ingredients"],
 price: data.price as number,
    sizes: (data.sizes as Product["sizes"]) ?? [],
    imageUrl: (data.imageUrl as string) ?? null,
    isAvailable: data.isAvailable as boolean,
    isFeatured: data.isFeatured as boolean,
    badges: (data.badges as Product["badges"]) ?? [],
    isActive: data.isActive as boolean,
    order: data.order as number,
    createdAt: data.createdAt as number,
    updatedAt: data.updatedAt as number,
  };
}

// Real-time listener for the customer menu. Filters out soft-deleted
// products so they never appear, regardless of availability toggle.
export function subscribeToProducts(onChange: (products: Product[]) => void) {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((d) => mapProduct(d.id, d.data()));
    onChange(products);
  });
}

// One-time fetch used in the admin panel (includes soft-deleted items).
export async function getAllProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapProduct(d.id, d.data()));
}

export async function createProduct(input: ProductInput): Promise<string> {
  const now = Date.now();
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...input,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
    ...input,
    updatedAt: Date.now(),
  });
}

// Hard delete: permanently removes the product document. No trash bin,
// no isActive flag - once this runs, the document is gone from Firestore.
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}
export async function toggleAvailability(
  id: string,
  isAvailable: boolean
): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
    isAvailable,
    updatedAt: Date.now(),
  });
}
