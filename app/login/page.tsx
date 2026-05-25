"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [guestLoading, setGuestLoading] =
    useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await signIn(
        "credentials",
        {
          email: form.email,
          password: form.password,
          redirect: false,
        }
      );

      if (res?.error) {
        setError("Invalid email or password");
        return;
      }

      const sessionRes = await fetch(
        "/api/auth/session"
      );

      const session =
        await sessionRes.json();

      if (
        session?.user?.role === "ADMIN"
      ) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // GUEST LOGIN
  const handleGuestLogin = async () => {
    try {
      setGuestLoading(true);

      const res = await fetch(
        "/api/auth/guest",
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black">
          Welcome
        </h1>

        <p className="mt-2 text-gray-500">
          Login to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-4"  
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border p-4 outline-none focus:border-black"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border p-4 outline-none focus:border-black"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
          />
          {error && (
              <p className="text-sm font-medium text-red-500">
                {error}
              </p>
            )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-gray-800"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-sm text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* GUEST LOGIN */}
        <button
          onClick={handleGuestLogin}
          disabled={guestLoading}
          className="w-full rounded-2xl border border-black py-4 font-semibold transition hover:bg-black hover:text-white"
        >
          {guestLoading
            ? "Entering..."
            : "Continue as Guest"}
        </button>

        {/* REGISTER */}
        <p className="mt-8 text-center text-gray-500">
          Don&apos;t have account?{" "}

          <Link
            href="/register"
            className="font-semibold text-black hover:underline"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}