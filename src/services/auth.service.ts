import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/firebase/config";

// Only the restaurant owner ever calls this - there is no customer-facing
// sign up flow anywhere in the app.
export async function loginAdmin(email: string, password: string): Promise<User> {
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return credentials.user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

// Subscribes to auth state so the admin layout can redirect to /admin/login
// whenever there is no signed-in user (e.g. after logout, or session expiry).
export function subscribeToAuthState(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}
