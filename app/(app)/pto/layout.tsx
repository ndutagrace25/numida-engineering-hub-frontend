import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PTO — Standup Hub",
};

export default function PTOLayout({ children }: { children: React.ReactNode }) {
  return children;
}
