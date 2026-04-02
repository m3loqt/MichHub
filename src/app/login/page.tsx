"use client";

import { Suspense, useState, useRef, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current?.value ?? "",
          password: passwordRef.current?.value ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed");
        if (passwordRef.current) passwordRef.current.value = "";
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
      autoComplete="off"
    >
      <h1 className="mb-6 text-lg font-bold uppercase tracking-wider text-white">
        Sign In
      </h1>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/60"
        >
          Username
        </label>
        <input
          id="username"
          ref={usernameRef}
          type="text"
          autoComplete="username"
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:opacity-50"
          placeholder="Username"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/60"
        >
          Password
        </label>
        <input
          id="password"
          ref={passwordRef}
          type="password"
          autoComplete="current-password"
          required
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-xl bg-[#F97316] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#ea6c0a] disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold uppercase italic tracking-widest text-white">
            MICHHUB
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#F97316]">
            Admin Portal
          </p>
        </div>
        <Suspense fallback={<div className="h-64 rounded-2xl border border-white/10 bg-white/5" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
