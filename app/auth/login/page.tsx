import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Log in — Standup Hub",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
}
