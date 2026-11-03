import Link from "next/link";

type Props = {
  href: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
  className?: string;
};

export default function LinkButton({ href, variant = "primary", children, className = "" }: Props) {
  if (variant === "primary") {
    return <Link href={href} className={`btn ${className}`}>{children}</Link>;
  }
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 font-semibold ${className}`}
      style={{ borderColor: "var(--border)" }}
    >
      {children}
    </Link>
  );
}