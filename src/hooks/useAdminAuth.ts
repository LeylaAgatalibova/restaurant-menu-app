"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthState, logoutAdmin } from "@/services/auth.service";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

type AdminAuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthorized: boolean;
};

// Being logged in to Firebase Auth is not enough by itself - we also check
// that the signed-in UID matches the one owner UID configured in env vars.
// This is what makes the admin panel single-owner-only: even if someone
// else's email/password ended up valid in Firebase Auth, they still
// wouldn't get in unless their UID matches.
export function useAdminAuth(): AdminAuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);

      if (firebaseUser && firebaseUser.uid !== ADMIN_UID) {
        // Signed in, but not the owner - immediately sign them back out.
        logoutAdmin();
      }
    });
    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isAuthorized: !!user && user.uid === ADMIN_UID,
  };
}
