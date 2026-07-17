import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standups — Standup Hub",
};

export default function StandupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
