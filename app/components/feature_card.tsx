import type { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; title: string; body: string };

export default function FeatureCard({ icon: Icon, title, body }: Props) {
  return (
    <div className="card">
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "color-mix(in srgb, var(--brand) 15%, transparent)", color: "var(--brand)" }}
      >
        <Icon size={22} />
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{body}</p>
    </div>
  );
}