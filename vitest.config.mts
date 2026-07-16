import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Native tsconfig "paths" resolution (Vite 6+ / Vitest 4+), so the "@/*"
    // alias works the same in tests as it does in the Next.js app itself.
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // Playwright owns tests/e2e — Vitest's default include pattern would
    // otherwise also pick up its *.spec.ts files.
    exclude: ["node_modules/**", "tests/e2e/**"],
  },
});
