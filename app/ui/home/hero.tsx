import { ArrowRight } from "lucide-react";
import LinkButton from "../../components/button";

export default function Hero() {
  return (
    <section className="py-10 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
        A safe space to <span style={{ color: "var(--brand)" }}>check in</span> with yourself
      </h1>
      <p className="mx-auto mt-4 max-w-xl" style={{ color: "var(--muted)" }}>
        MindSpace is an anonymous wellness space for young Kenyans, with gentle support, helpful
        resources, and help close by when you need it.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/auth/register">
          Get started <ArrowRight size={18} />
        </LinkButton>
        <LinkButton href="/auth/login" variant="outline">Log in</LinkButton>
      </div>
    </section>
  );
}