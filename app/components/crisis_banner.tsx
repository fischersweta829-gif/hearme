import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export default function CrisisBanner() {
  return (
    <div className="flex w-full items-center justify-center gap-2 bg-rose-600 px-4 py-1.5 text-sm text-white">
      <LifeBuoy size={16} />
      <span>Need help right now?</span>
      <Link href="/crisis" className="font-semibold underline">Get support</Link>
    </div>
  );
}