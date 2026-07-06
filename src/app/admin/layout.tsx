import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../globals.css";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Admin - Restaurant Menu",
};

// The admin panel is intentionally English-only and lives outside the
// [locale] segment - see src/proxy.ts for why. This is its own root
// layout since it's a separate top-level branch of the app directory.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} antialiased bg-neutral-50 text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
