import { Suspense } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";

export interface AppShellProps {
  title: string;
  children: React.ReactNode;
}

/**
 * The authenticated application shell: a fixed sidebar (hidden below the
 * `lg` breakpoint, replaced by TopBar's MobileNav drawer) plus a main
 * column with the top bar and scrollable page content. Mirrors the
 * design's `display:flex;height:100vh` structure.
 */
export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="bg-card text-foreground flex h-dvh w-full overflow-hidden">
      <div className="hidden lg:block">
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar title={title} />
        <div className="bg-background flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
