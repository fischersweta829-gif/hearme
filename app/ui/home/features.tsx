import { HeartHandshake, Languages, ShieldCheck } from "lucide-react";
import FeatureCard from "../../components/feature_card";

const FEATURES = [
  { icon: HeartHandshake, title: "Check in, privately", body: "Log how you feel in a few taps or a few lines. Your journal stays yours." },
  { icon: Languages, title: "Speak your way", body: "Write in English, Kiswahili, Sheng, or a mix. Nobody will judge your words." },
  { icon: ShieldCheck, title: "Anonymous by design", body: "Use a pseudonym. No real names, no tracking, and you can delete your data any time." },
];

export default function Features() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
    </section>
  );
}