import { ExternalLink, GitPullRequest } from "lucide-react";

import {
  StatusBadge,
  backendPullRequestStatus,
} from "@/components/ui/status-badge";
import { formatShortDate } from "@/lib/format-date";
import type { PullRequestLink } from "@/types/pull-requests";

export interface PRGroupProps {
  groupName: string;
  links: PullRequestLink[];
}

/** One group's outstanding pull requests, grouped under its group_name. */
export function PRGroup({ groupName, links }: PRGroupProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <GitPullRequest
          className="text-muted-foreground size-[15px]"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <div className="text-text-icon font-mono text-[13.5px] font-semibold">
          {groupName}
        </div>
      </div>
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        {links.map((link, i) => {
          const status = backendPullRequestStatus(link.status);
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:bg-muted/50 focus-visible:ring-ring flex items-center gap-3 p-[14px_18px] outline-none focus-visible:ring-2 focus-visible:-outline-offset-2 ${
                i < links.length - 1 ? "border-border-subtle border-b" : ""
              }`}
            >
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              <div className="min-w-0 flex-1">
                <div className="text-sidebar-primary truncate text-[13.5px] font-semibold">
                  {link.title}
                </div>
                <div className="text-muted-foreground mt-0.5 text-xs">
                  {link.createdBy?.displayName ?? "Unknown"} · updated{" "}
                  {formatShortDate(link.createdAt)}
                </div>
              </div>
              <ExternalLink
                className="text-text-faint size-3.5 shrink-0"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
