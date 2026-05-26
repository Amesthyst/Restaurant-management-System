"use client";

import Link from "next/link";
import {
  signOut,
  useSession,
} from "next-auth/react";

type NavbarProps = {
  tableNo?: string;
};

export default function Navbar({
  tableNo,
}: NavbarProps) {
  const { data: session } =
    useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

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

        <div className="flex items-center gap-3">
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