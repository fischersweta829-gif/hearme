import Link from "next/link";

const FEATURES = [
  { icon: "🫶", title: "Check in, privately", body: "Log how you feel in a few taps or a few lines. Your journal stays yours." },
  { icon: "🗣️", title: "Speak your way", body: "Write in English, Kiswahili, Sheng, or a mix. Nobody will judge your words." },
  { icon: "🔒", title: "Anonymous by design", body: "Use a pseudonym. No real names, no tracking, and you can delete your data any time." },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="py-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          A safe space to <span style={{ color: "var(--brand)" }}>check in</span> with yourself
        </h1>
        <p className="mx-auto mt-4 max-w-xl" style={{ color: "var(--muted)" }}>
          MindSpace is an anonymous wellness space for young Kenyans, with gentle support, helpful
          resources, and help close by when you need it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/auth/register" className="btn">Get started</Link>
          <Link href="/auth/login" className="rounded-xl border px-4 py-2 font-semibold" style={{ borderColor: "var(--border)" }}>
            Log in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(f => (
          <div key={f.title} className="card">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{f.body}</p>
          </div>
        ))}
      </section>

      <section className="card text-sm" style={{ color: "var(--muted)" }}>
        MindSpace is part of a university research project. It is <strong>not</strong> a medical
        service and does not diagnose anyone. If you are in danger or thinking about harming yourself,
        please visit our <Link href="/crisis" className="underline">crisis page</Link> now.
      </section>
    </div>
  );
}