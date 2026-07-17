# Numida Engineering Hub — Frontend

Frontend foundation for the Numida Engineering Hub: standups, presence, AOB,
PTO, and pull-request links, backed by the
[Numida Engineering Hub backend](../numida_engineering_hub_backend).

**Status:** authentication, the Dashboard, and Standups are connected to
the real Django backend (see [Authentication](#authentication) and
[Standups](#standups) below). PTO, AOB, and Pull Requests still run on
local fixture data in `lib/fixtures/` and are connected to the backend in
later tasks — the Dashboard's own "Recent Activity" widget stays on
fixture data too, since the backend has no activity-feed endpoint.

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
  page.tsx                Redirects "/" to /dashboard
  globals.css             Tailwind + ShadCN CSS variables, remapped to the
                          imported design's tokens
  auth/login/             The login route (backed by the real backend)
  (app)/                  Route group for every authenticated screen
                          (dashboard, standups, pto, aob, pull-requests,
                          profile) — app/(app)/layout.tsx gates all of it
                          behind ProtectedRoute

components/
  ui/                     ShadCN UI primitives, customized to match the
                          imported design
  layout/                 App shell: sidebar, top bar, mobile nav, user menu
  auth/                   AuthCard, LoginForm, LoginView, ProtectedRoute
  dashboard/  standups/  presence/  aob/  pto/  pull-requests/
                          Module-specific components, still backed by mock
                          data (see lib/fixtures/)

hooks/
  use-auth.ts              useAuth() — reads the AuthContext set up by
                          providers/auth-provider.tsx

lib/
  api/
    client.ts              The shared Axios instance every feature calls
                          through — reads NEXT_PUBLIC_API_BASE_URL, sends
                          the session cookie via withCredentials, and
                          attaches Django's CSRF header on state-changing
                          requests (see Authentication below)
    auth.ts                 login()/logout()/fetchCurrentUser(), mapping the
                          backend's snake_case user payload to AuthUser
    errors.ts               getApiError()/getErrorMessage(): normalize any
                          caught request error into the shared ApiError type
                          and a safe user-facing message
  fixtures/                Mock data for every module except auth
  validations/            Reserved for shared Zod schemas beyond the
                          per-form ones already colocated with each form
  utils.ts                 ShadCN's cn() class-merging helper

providers/
  query-provider.tsx        TanStack Query's QueryClientProvider, set up per
                          TanStack's recommended Next.js App Router pattern
                          (a fresh QueryClient per server request, a stable
                          singleton in the browser)
  auth-provider.tsx          Owns the authenticated session (current user,
                          login, logout, refreshUser) — see Authentication
  app-providers.tsx          Composes every provider into one component —
                          app/layout.tsx only ever imports this one

types/
  api.ts                   ApiError and the backend's success/error envelope
                          shapes, shared across every API call
  auth.ts                  AuthUser, LoginCredentials

tests/
  setup.ts                 Vitest setup: registers jest-dom matchers and
                          React Testing Library's cleanup
  unit/                    Vitest + React Testing Library unit tests
  e2e/                     Playwright end-to-end tests — auth.setup.ts logs
                          in once and shares that session across specs;
                          auth.spec.ts itself runs unauthenticated

public/                 Static assets
```

## Environment variables

Copy `.env.example` to `.env` before running the app:

```bash
cp .env.example .env
```

| Variable                   | Purpose                                                                                      | Example                        |
| -------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API. Public (`NEXT_PUBLIC_*`) because the browser calls it directly. | `http://localhost:8000/api/v1` |

## Authentication

Authentication is real — backed by the Django backend's session auth, not
mock data. Every other module (Dashboard, Standups, Presence, PTO, AOB,
Pull Requests) still runs on `lib/fixtures/` and is unaffected.

### Backend endpoints used

| Method | Path            | Purpose                                                   |
| ------ | --------------- | --------------------------------------------------------- |
| POST   | `/auth/login/`  | Authenticate with `{ email, password }`, starts a session |
| POST   | `/auth/logout/` | Ends the session                                          |
| GET    | `/auth/me/`     | The current session's user                                |

All three live under `NEXT_PUBLIC_API_BASE_URL` (e.g.
`http://localhost:8000/api/v1/auth/login/`). Request/response shapes come
straight from the backend's OpenAPI schema at `/api/schema/` — see
`lib/api/auth.ts`.

### Session management

- Sessions are a `sessionid` **HttpOnly cookie** set by the backend — there
  is no token stored in `localStorage`/`sessionStorage`, so a stolen XSS
  payload can't exfiltrate it.
- `providers/auth-provider.tsx` wraps the app in an `AuthContext` backed by
  a single TanStack Query (`["auth", "current-user"]`) that calls
  `GET /auth/me/` once on startup and is shared by every consumer of
  `useAuth()` (`hooks/use-auth.ts`) — no duplicate requests.
- `useAuth()` exposes `user`, `isAuthenticated`, `isLoading`, `login()`,
  `logout()`, and `refreshUser()`.
- Refreshing the browser re-runs that same query using the cookie the
  browser already has, so the session survives a reload with no extra code.
- `login()`/`logout()` update the cached user directly (`setQueryData`)
  instead of waiting on a refetch, and `logout()`'s cache-clearing runs in
  `onSettled` — the local session is always cleared even if the backend
  call itself fails (e.g. a network error), so the user never gets stuck
  looking logged in on a screen they've already left.

### CSRF handling

Django's session auth enforces CSRF on every state-changing request made by
an authenticated session (login itself doesn't need it — there's no session
yet at that point). The shared Axios client (`lib/api/client.ts`) is
configured to handle this automatically:

```ts
withCredentials: true,     // send the sessionid cookie
withXSRFToken: true,       // required cross-origin (frontend/backend are different ports/origins)
xsrfCookieName: "csrftoken",
xsrfHeaderName: "X-CSRFToken",
```

Axios reads the `csrftoken` cookie Django sets and echoes it back as
`X-CSRFToken` on every request — no manual token plumbing needed, and CSRF
protection is never disabled.

### Protected routes

`app/(app)/layout.tsx` wraps every authenticated route in
`components/auth/protected-route.tsx`, which:

- redirects to `/auth/login?next=<path>` when there's no session,
  preserving the page the visitor was trying to reach;
- redirects an already-authenticated visitor away from `/auth/login`
  (back to `next`, or `/dashboard`);
- renders nothing while the session check or a redirect is in flight, so
  protected content never flashes for a logged-out visitor.

### Required backend configuration

The frontend and backend run on different origins in local dev
(`localhost:3000` vs `localhost:8000`), which matters for cookie-based auth:

- The backend's `CORS_ALLOWED_ORIGINS` must include the frontend's origin
  **and** `CORS_ALLOW_CREDENTIALS = True` — without it, browsers refuse any
  `withCredentials` request regardless of what else is configured.
- `CSRF_TRUSTED_ORIGINS` must also include the frontend's origin, or every
  authenticated POST (e.g. logout) gets a `403 CSRF Failed: Origin checking
failed`.
- **Always access the app via `http://localhost:3000`, never
  `http://127.0.0.1:3000`.** Chrome treats them as different sites for
  `SameSite=Lax` cookie purposes, so a page served from `127.0.0.1` would
  silently never receive or send the session cookie at all. This is also
  why `playwright.config.ts`'s `baseURL` is `localhost`, not `127.0.0.1`.

The backend repo's `.env`/`.env.example` already list both origins for
local dev (`http://localhost:3000,http://127.0.0.1:3000` — the latter kept
only because Playwright's default host used to be `127.0.0.1`).

### No self-registration

The backend has no signup/registration endpoint — accounts are provisioned
directly (Django admin, or the shell one-liner below). The design's
"Create an account" register screen is intentionally not wired up for this
reason.

## Dashboard

`GET /dashboard/?week_start=<Monday>` is a single aggregate endpoint —
standup submission totals, that week's standups, presence, AOB, PTO, and
pull request links — powering every dashboard widget except Recent
Activity (no backend equivalent exists, so it stays on `lib/fixtures/`).
`lib/api/dashboard.ts` maps the response to `types/dashboard.ts`;
`components/dashboard/dashboard-view.tsx` fetches it via TanStack Query,
always for the current week (`lib/week.ts` computes that week's Monday,
since the backend requires an exact Monday date).

A few backend gaps worth knowing about:

- No `role`/team field on `User` — same as the sidebar/profile, any widget
  that would show a role just omits that line.
- `AOBItem` has no `tag`/category field — the dashboard's AOB preview
  never showed one anyway.
- `PullRequestLink.status` is `OPEN` / `IN_REVIEW` / `CHANGES_REQUESTED` /
  `APPROVED` / `BLOCKED` — not the design's `Merged`/`Draft`. `Approved`
  and `Blocked` reuse the closest existing status-badge color
  (`components/ui/status-badge.tsx`'s `backendPullRequestStatus()`)
  rather than inventing new ones.

**Presence heartbeat:** `presence.online/recently_active/offline` is
derived entirely from each user's last `POST /presence/heartbeat/` call —
nothing marks a user online just because they're authenticated.
`components/presence/presence-heartbeat.tsx` sends one on mount and every
60 seconds after (half the backend's 2-minute online threshold), mounted
once inside `ProtectedRoute` so it runs for the whole signed-in session
without restarting on every in-app navigation.

## Standups

Backed by the full `apps.standups` CRUD API: `POST /standups/` (create),
`PATCH /standups/<id>/` (update), `GET /standups/weekly/?week_start=` (a
week's standups, unpaginated), and `GET /standups/` (every standup,
filterable by `user`/`standup_date`/`date_after`/`date_before`/`search`).
`lib/api/standups.ts` wraps all four; `components/standups/
standup-mapping.ts` holds every Standup ↔ view-model mapping used across
the three connected screens.

**Convention, not a backend rule:** a "standup" models one calendar day
(`standup_date`, unique per user per day), but this app treats each
user's entry as covering their whole week, dated to that week's Monday
(`lib/week.ts`'s `getMondayOf()`). `/standups` checks for an existing
entry at `standup_date=<this week's Monday>` for the signed-in user —
found means edit (PATCH), not found means create (POST).

- **`/standups`** — loads the current week's existing entry if there is
  one (else starts blank), and POSTs/PATCHes on submit. `blockers` is a
  single free-text field on the backend, not an itemized section — it's
  split on newlines into the same bullet-list editor as the other
  sections, and joined back with `\n` on save. The design's "autosaves as
  you type" subtitle was never real even before this connection — changed
  to the actual week range, since the Submit button is the only save path.
- **`/standups/weekly`** — `?week=<Monday date>` replaces the design's
  0/1 "this week"/"last week" offset scheme, since real weeks aren't
  bounded to two. Prev/Next shift by 7 days with no artificial limit; an
  empty week just shows the empty state.
- **`/standups/history`** — search, month, and week filters all map onto
  real `GET /standups/` query params rather than client-side filtering.
  Month/week options are a computed rolling window (last 6 months, last
  12 weeks) — the design's own dropdowns had no backend concept behind
  them, so each option carries a real `date_after`/`date_before` range
  instead. The engineer filter (Team tab) maps to `user=<id>`, with
  options from a lightweight `GET /users/` fetch.

## Running locally

Requires Node.js 20+ and the backend running separately for login to work
(the app itself loads without it, but every route past login is protected).

```bash
# backend (from ../numida_engineering_hub_backend)
python manage.py runserver 8000

# frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll land on
`/auth/login`. Create a test account first if the backend has none yet:

```bash
# from the backend repo, with its venv active
python manage.py shell -c "
from apps.accounts.models import User
u, _ = User.objects.get_or_create(email='qa.tester@numida.com', defaults={'first_name': 'Qa', 'last_name': 'Tester'})
u.set_password('TestPass123!')
u.save()
"
```

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
production server itself before running, against Chromium. Browsers are
installed via:

```bash
npx playwright install chromium
```

The suite requires the real backend running on `localhost:8000` (auth
tests hit it directly) and the test account from
[Running locally](#running-locally). `auth.setup.ts` logs in once and saves
the session so `navigation.spec.ts` and future specs start already
authenticated; `auth.spec.ts` itself runs unauthenticated, since it tests
the login flow directly. Override the account via env vars if needed:

```bash
E2E_TEST_EMAIL=other@numida.com E2E_TEST_PASSWORD=... npm run test:e2e
```

## Production build

```bash
npm run build
npm run start
```

## Adding a new feature (future work)

1. Most feature routes already exist under `app/(app)/` — connect them to
   the backend rather than adding new placeholders.
2. Add API calls through `lib/api/client.ts`, wrapped in TanStack Query
   hooks (`useQuery`/`useMutation`) — don't call Axios directly from
   components.
3. Add Zod schemas under `lib/validations/` and wire them into
   React Hook Form via `@hookform/resolvers/zod`.
4. Add ShadCN components as needed with `npx shadcn add <component>` —
   they land in `components/ui/`.
5. Add unit tests under `tests/unit/` and, for user-facing flows, an E2E
   test under `tests/e2e/`.
