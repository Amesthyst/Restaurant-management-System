"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function GuestTimer() {
  const { data: session } =
    useSession();

  useEffect(() => {
    if (!session?.user?.email) return;

    // detect guest account
    if (
      session.user.email.includes(
        "@guest.com"
      )
    ) {
      const timer = setTimeout(() => {
        alert(
          "Guest session expired"
        );

        signOut({
          callbackUrl: "/login",
        });
      }, 1000 * 60 * 30);

      return () =>
        clearTimeout(timer);
    }
  }, [session]);

  return null;
}