import {
  Calendar,
  ClipboardList,
  GitPullRequest,
  History,
  LayoutGrid,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Matches this item as active even on a query-string variant of href. */
  matchPrefix?: string;
}

/**
 * Main sidebar navigation, in the same order as the imported design.
 * Icons are Lucide equivalents of the design's inline SVGs (exact
 * exported icon assets weren't available — see the report for the exact
 * mapping used per icon).
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Standups", href: "/standups", icon: ClipboardList },
  {
    label: "My History",
    href: "/standups/history?tab=my",
    icon: History,
    matchPrefix: "/standups/history",
  },
  {
    label: "Team History",
    href: "/standups/history?tab=team",
    icon: Users,
    matchPrefix: "/standups/history",
  },
  { label: "PTO", href: "/pto", icon: Calendar },
  { label: "AOB", href: "/aob", icon: Presentation },
  { label: "Pull Requests", href: "/pull-requests", icon: GitPullRequest },
];
