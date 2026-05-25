"use client";

import Link from "next/link";
import {
  signOut,
  useSession,
} from "next-auth/react";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/store/cart-store";

type NavbarProps = {
  tableNo?: string;
};

export default function Navbar({
  tableNo,
}: NavbarProps) {
  const { data: session } =
    useSession();

  const items = useCart(
    (state) => state.items
  );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            🍽 Restaurant
          </Link>

          {tableNo && (
            <div className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white shadow">
              Table {tableNo}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* CART ICON */}
          {tableNo && (
            <Link
              href={`/table/${tableNo}/cart`}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md transition hover:scale-105 hover:bg-orange-600"
            >
              <ShoppingBag size={20} />

              {/* LIVE BADGE */}
              {totalItems > 0 && (
                <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow">
                  {totalItems}
                </div>
              )}
            </Link>
          )}

          {session ? (
            <>
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold">
                  {session.user?.name}
                </p>

                <p className="text-xs text-gray-500">
                  Logged In
                </p>
              </div>

              <button
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
                className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}