import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Use these instead of next/link and next/navigation anywhere in the
// customer-facing app - they automatically keep the /az, /en, /ru, /tr
// prefix in sync when navigating.
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
