import "./globals.css";
import type { Metadata } from "next";
import CrisisBanner from "./components/crisis_banner";
import Navbar from "./components/navbar";
import { themeInitScript } from "./lib/theme";

export const metadata: Metadata = {
  title: "Hear Me Youth Wellness",
  description: "An anonymous, privacy-conscious wellness space for Kenyan youth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* suppressHydrationWarning on body: browser extensions inject attributes here */}
      <body suppressHydrationWarning>
        <CrisisBanner />
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}