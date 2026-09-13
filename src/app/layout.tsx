import type { Metadata, Viewport } from "next";
import { Hind } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Headings — Hind Bold.
const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body — Amulya Regular. Self-hosted from Fontshare so there's no runtime
// dependency on their CDN.
const amulya = localFont({
  variable: "--font-amulya",
  display: "swap",
  src: [
    { path: "../../public/fonts/Amulya-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Amulya-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Amulya-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Vitals",
  description: "Training and nutrition, one day at a time",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F8F5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hind.variable} ${amulya.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
