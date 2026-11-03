"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, Me } from "../lib/api";
import { toggleTheme } from "../lib/theme";

const LINKS: Record<string, { href: string; label: string }[]> = {
  youth: [
    { href: "/home", label: "Home" },
    { href: "/checkin", label: "Check-in" },
    { href: "/journal", label: "Journal" },
    { href: "/resources", label: "Resources" },
  ],
  staff: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/sentiment", label: "Sentiment" },
    { href: "/dashboard/clusters", label: "Clusters" },
    { href: "/dashboard/models", label: "Models" },
  ],
};

export default function Navbar() {
  const [me, setMe] = useState<Me | null>(null);
  const router = useRouter();

  useEffect(() => { api.me().then(setMe).catch(() => setMe(null)); }, []);

  const links = me ? (me.role === "youth" ? LINKS.youth : LINKS.staff) : [];

  async function logout() {
    await api.logout().catch(() => {});
    setMe(null);
    router.push("/auth/login");
  }

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="text-lg font-bold" style={{ color: "var(--brand)" }}>
          MindSpace
        </Link>
        <div className="hidden flex-1 gap-4 text-sm md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:underline">{l.label}</Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <button onClick={() => toggleTheme()} aria-label="Toggle theme">🌓</button>
          {me ? (
            <>
              <span style={{ color: "var(--muted)" }}>{me.pseudonym}</span>
              <button onClick={logout} className="underline">Log out</button>
            </>
          ) : (
            <Link href="/auth/login" className="btn">Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}