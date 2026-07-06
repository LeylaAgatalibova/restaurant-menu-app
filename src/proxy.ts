import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only the customer-facing menu is localized. The admin panel
  // (Milestone 4) lives outside the [locale] segment on purpose - the
  // restaurant owner doesn't need a translated admin UI, so /admin is
  // excluded here and never gets a locale prefix.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
