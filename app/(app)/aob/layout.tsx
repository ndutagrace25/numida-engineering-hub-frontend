import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AOB — Standup Hub",
};

export default function AOBLayout({ children }: { children: React.ReactNode }) {
  return children;
}
