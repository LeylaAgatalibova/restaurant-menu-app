"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, UtensilsCrossed, Tag, Settings, LogOut } from "lucide-react";
import { logoutAdmin } from "@/services/auth.service";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: UtensilsCrossed },
  { href: "/admin/badges", label: "Badges", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

// Horizontal, scrollable bar on mobile; a fixed vertical sidebar from
// md: up. This is what keeps the admin panel usable on a phone instead
// of squished into a 56px-wide column.
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 md:shrink-0 md:min-h-screen border-b md:border-b-0 md:border-r border-neutral-200 bg-white p-3 md:p-4 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
      <h1 className="hidden md:block text-sm font-semibold px-2 mb-6">Restaurant Admin</h1>

      <nav className="flex flex-row md:flex-col gap-1 md:flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 flex items-center gap-2 md:gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => logoutAdmin()}
        className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
      >
        <LogOut size={16} />
        <span className="md:inline">Log out</span>
      </button>
    </aside>
  );
}
