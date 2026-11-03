import Hero from "./ui/home/hero";
import Features from "./ui/home/features";
import ResearchNotice from "./ui/home/research_notice";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <Hero />
      <Features />
      <ResearchNotice />
    </div>
  );
}