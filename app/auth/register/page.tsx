"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { homeFor } from "../../lib/auth";
import Spinner from "../../components/spinner";

const AGE_BANDS = ["13–17", "18–24", "25–35"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ pseudonym: "", password: "", confirm: "", age_band: "" });
  const [consent, setConsent] = useState(false);
  const [guardian, setGuardian] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isMinor = form.age_band === "13–17";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (!consent) return setError("Please agree to the consent statement to continue.");
    if (isMinor && !guardian) return setError("A parent or guardian must agree before you can join.");

    setLoading(true);
    try {
      const me = await api.register({
        pseudonym: form.pseudonym.trim(),
        password: form.password,
        age_band: form.age_band,
        consent,
        guardian_consent: isMinor ? guardian : undefined,
      });
      router.push(homeFor(me.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={onSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Choose a pseudonym.(Anonymous)
        </p>

        <label className="block text-sm">
          Pseudonym
          <input className="input mt-1" value={form.pseudonym} onChange={set("pseudonym")}
                 minLength={3} maxLength={24} autoComplete="username" required />
        </label>

        <label className="block text-sm">
          Age group
          <select className="input mt-1" value={form.age_band} onChange={set("age_band")} required>
            <option value="" disabled>Select…</option>
            {AGE_BANDS.map(a => <option key={a}>{a}</option>)}
          </select>
        </label>

        <label className="block text-sm">
          Password
          <input className="input mt-1" type="password" value={form.password}
                 onChange={set("password")} autoComplete="new-password" required />
        </label>

        <label className="block text-sm">
          Confirm password
          <input className="input mt-1" type="password" value={form.confirm}
                 onChange={set("confirm")} autoComplete="new-password" required />
        </label>

        <div className="space-y-2 rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
          <label className="flex gap-2">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
            <span>
              I understand this is a university research project, that my anonymised text may be analysed
              by computer models to study patterns of wellbeing, and that it is not a medical service or
              diagnosis. I can delete my data at any time.
            </span>
          </label>
          {isMinor && (
            <label className="flex gap-2">
              <input type="checkbox" checked={guardian} onChange={e => setGuardian(e.target.checked)} />
              <span>My parent or guardian has read this and agrees to my taking part.</span>
            </label>
          )}
        </div>

        {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

        <button className="btn flex w-full items-center justify-center gap-2" disabled={loading}>
          {loading && <Spinner size={16} />} Create account
        </button>

        <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
          Already have an account? <Link href="/auth/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}