# Numida Engineering Hub — Frontend

Frontend foundation for the Numida Engineering Hub: standups, presence, AOB,
PTO, and pull-request links, backed by the
[Numida Engineering Hub backend](../numida_engineering_hub_backend).

**Status:** foundation only. This repository currently provides the
Next.js/TypeScript/Tailwind/ShadCN/TanStack Query project scaffolding, a
reusable Axios API client, and testing tooling — no product pages, no
authentication, and no design system yet. Those are built in later tasks on
top of this foundation.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) + [ShadCN UI](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for server state
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms/validation
- [Axios](https://axios-http.com) for API calls
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit tests
- [Playwright](https://playwright.dev) for end-to-end tests
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) for linting/formatting

## Folder structure

```
app/                     Next.js App Router routes
  layout.tsx             Root layout — wraps the app in AppProviders
  page.tsx                Temporary placeholder home page
  globals.css             Tailwind + ShadCN CSS variables (no theme colors yet)
  auth/  dashboard/  standups/  presence/  aob/  pto/  pull-requests/
                          Empty placeholders for each future route/module —
                          intentionally contain no page.tsx yet, so none of
                          them are routable until their feature task adds one

components/
  ui/                     ShadCN UI primitives (generated via the shadcn CLI)
  layout/                 Reserved for the future header/sidebar/footer —
                          empty until that task

hooks/                  Reserved for shared custom React hooks — empty for now

lib/
  api/
    client.ts              The shared Axios instance every feature calls
                          through — reads NEXT_PUBLIC_API_BASE_URL, sends
                          the session cookie via withCredentials
    errors.ts               getApiError(): normalizes any caught request
                          error into the shared ApiError type
  auth/                   Reserved for session/auth logic — empty until the
                          auth task
  validations/            Reserved for shared Zod schemas — empty until the
                          first real form exists
  utils.ts                 ShadCN's cn() class-merging helper

providers/
  query-provider.tsx        TanStack Query's QueryClientProvider, set up per
                          TanStack's recommended Next.js App Router pattern
                          (a fresh QueryClient per server request, a stable
                          singleton in the browser)
  app-providers.tsx          Composes every provider into one component —
                          app/layout.tsx only ever imports this one

types/
  api.ts                   ApiError and the backend's success/error envelope
                          shapes, shared across every future API call

tests/
  setup.ts                 Vitest setup: registers jest-dom matchers and
                          React Testing Library's cleanup
  unit/                    Vitest + React Testing Library unit tests
  e2e/                     Playwright end-to-end tests (one smoke test so far)

public/                 Static assets
```

Every placeholder directory above is intentionally empty (holding only a
`.gitkeep`) — this task adds the shape of the project, not its features.

## Environment variables

Copy `.env.example` to `.env` before running the app:

```bash
cp .env.example .env
```

| Variable                   | Purpose                                                                                      | Example                        |
| -------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API. Public (`NEXT_PUBLIC_*`) because the browser calls it directly. | `http://localhost:8000/api/v1` |

## Running locally

Requires Node.js 20+ and the backend running separately (see the backend
repo's README) if you want API calls to succeed once they're implemented.

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see a
placeholder page confirming the foundation (Next.js, Tailwind, ShadCN UI,
TanStack Query) is running, along with the configured API base URL.

## Linting

```bash
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
```

`eslint-config-prettier` is included so ESLint never disagrees with Prettier
about formatting — ESLint only flags real problems.

## Formatting

```bash
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

`prettier-plugin-tailwindcss` automatically sorts Tailwind utility classes
into a consistent order.

## Unit tests

```bash
npm run test        # vitest run — single pass, used for CI/validation
npm run test:watch  # vitest — interactive watch mode for local development
```

Vitest is configured with `jsdom` and React Testing Library.
`tests/setup.ts` registers `@testing-library/jest-dom` matchers and RTL's
`cleanup()` after every test (this project keeps Vitest's `globals` option
off, so cleanup is wired explicitly rather than relying on a global
`afterEach`). Tests live in `tests/unit/`, colocated by feature as more are
added.

## End-to-end tests

```bash
npm run test:e2e
```

Playwright is configured (`playwright.config.ts`) to build and start the
production server itself before running, against Chromium. Only one smoke
test exists so far (`tests/e2e/home.spec.ts`, confirming the home page
loads) — full product E2E coverage is added alongside each feature module.
Browsers are installed via:

```bash
npx playwright install chromium
```

## Production build

```bash
npm run build
npm run start
```

## Adding a new feature (future work)

1. Add the route under its existing placeholder in `app/` (e.g.
   `app/standups/page.tsx`).
2. Add API calls through `lib/api/client.ts`, wrapped in TanStack Query
   hooks (`useQuery`/`useMutation`) — don't call Axios directly from
   components.
3. Add Zod schemas under `lib/validations/` and wire them into
   React Hook Form via `@hookform/resolvers/zod`.
4. Add ShadCN components as needed with `npx shadcn add <component>` —
   they land in `components/ui/`.
5. Add unit tests under `tests/unit/` and, for user-facing flows, an E2E
   test under `tests/e2e/`.
