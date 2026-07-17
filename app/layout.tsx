import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

// The imported design (Standup Hub.dc.html) loads Roboto 400/500/600/700
// from Google Fonts as its one and only typeface. The CSS variable is
// named "--font-sans" (not "--font-roboto") to match what globals.css's
// @theme block already expects.
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Numida Engineering Hub — Standup Hub",
  description:
    "Internal engineering workspace: standups, presence, AOB, PTO, and pull requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
