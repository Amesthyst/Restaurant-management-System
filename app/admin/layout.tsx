"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, ClipboardList } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <aside className="hidden w-72 flex-col border-r bg-white p-6 lg:flex">
        <div>
          <h1 className="text-3xl font-black">🍽 Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Restaurant Management
          </p>
        </div>

        <nav className="mt-10 space-y-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-gray-100"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/admin/menu"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-gray-100"
          >
            <ShoppingBag className="h-5 w-5" />
            Menu
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-gray-100"
          >
            <ClipboardList className="h-5 w-5" />
            Orders
          </Link>
        </nav>
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
          className="mt-6 w-full rounded-xl bg-black px-4 py-3 text-white">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}