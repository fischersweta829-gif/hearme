"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api";
import { homeFor } from "../../lib/auth";
import Spinner from "../../components/spinner";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pseudonym, setPseudonym] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const me = await api.login(pseudonym.trim(), password);
      const next = params.get("next");
      router.push(next && next.startsWith("/") ? next : homeFor(me.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <form onSubmit={onSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Welcome back</h1>

        <label className="block text-sm">
          Pseudonym
          <input className="input mt-1" value={pseudonym} onChange={e => setPseudonym(e.target.value)}
                 autoComplete="username" required />
        </label>

        <label className="block text-sm">
          Password
          <input className="input mt-1" type="password" value={password}
                 onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

        <button className="btn flex w-full items-center justify-center gap-2" disabled={loading}>
          {loading && <Spinner size={16} />} Log in
        </button>

        <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
          <Link href="/auth/forgot-password" className="underline">Forgot password?</Link>
          <Link href="/auth/register" className="underline">Create account</Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <LoginForm />
    </Suspense>
  );
}