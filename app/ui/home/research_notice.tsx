import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export default function ResearchNotice() {
  return (
    <section className="card flex gap-3 text-sm" style={{ color: "var(--muted)" }}>
      <LifeBuoy size={20} className="mt-0.5 shrink-0 text-rose-500" />
      <p>
        MindSpace is part of a university research project. It is <strong>not</strong> a medical
        service and does not diagnose anyone. If you are in danger or thinking about harming yourself,
        please visit our <Link href="/crisis" className="underline">crisis page</Link> now.
      </p>
    </section>
  );
}