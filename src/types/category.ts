import { LocalizedText } from "./common";

export type Category = {
  id: string; // Firestore document ID
  name: LocalizedText;
  order: number; // controls display order on the menu
  isActive: boolean; // soft delete flag - false means "deleted" but kept in DB
  createdAt: number; // stored as Date.now() for simplicity
  updatedAt: number;
};

// Shape used when creating/editing a category in the admin panel,
// before Firestore assigns an id/timestamps.
export type CategoryInput = {
  name: LocalizedText;
  order: number;
};
