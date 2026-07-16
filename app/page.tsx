import { Button } from "@/components/ui/button";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "(not set — see .env.example)";

// Temporary placeholder confirming the foundation is wired up correctly.
// Replaced with the real home/landing experience once the design system
// and product pages are implemented.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-2xl font-semibold">
        Numida Engineering Hub — Frontend Foundation
      </h1>
      <p className="text-muted-foreground max-w-md">
        This placeholder confirms the Next.js, Tailwind CSS, ShadCN UI, and
        TanStack Query foundation is running. Product pages and the design
        system are implemented in later tasks.
      </p>
      <p className="text-muted-foreground text-sm">
        API base URL: <code>{apiBaseUrl}</code>
      </p>
      <Button variant="outline">ShadCN UI is wired up</Button>
    </main>
  );
}
