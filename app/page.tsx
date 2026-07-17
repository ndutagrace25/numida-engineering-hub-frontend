import { redirect } from "next/navigation";

// The imported design's prototype defaults to the authenticated app shell
// showing the dashboard (`isApp: true`, `screen: 'dashboard'`) rather than
// the login screen, so / redirects straight to /dashboard.
export default function Home() {
  redirect("/dashboard");
}
