import Link from "next/link";

export default function CrisisBanner() {
  return (
    <div className="w-full bg-rose-600 px-4 py-1.5 text-center text-sm text-white">
      Need help right now?{" "}
      <Link href="/crisis" className="font-semibold underline">
        Get support
      </Link>
    </div>
  );
}