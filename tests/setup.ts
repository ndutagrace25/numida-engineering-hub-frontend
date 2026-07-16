import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

// React Testing Library's automatic cleanup relies on detecting a global
// `afterEach` (e.g. from Jest, or Vitest's `test.globals: true`). Since
// this project keeps globals off and imports test functions explicitly,
// cleanup is registered here instead.
afterEach(() => {
  cleanup();
});
