import { ExternalLink, GitPullRequest } from "lucide-react";

import {
  StatusBadge,
  pullRequestStatusTone,
} from "@/components/ui/status-badge";
import type { PullRequestGroup } from "@/types/pull-requests";

export interface PRGroupProps {
  group: PullRequestGroup;
}

/** One repo's outstanding pull requests, grouped under its repo name. */
export function PRGroup({ group }: PRGroupProps) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <GitPullRequest
          className="text-muted-foreground size-[15px]"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <div className="text-text-icon font-mono text-[13.5px] font-semibold">
          {group.repo}
        </div>
      </div>
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        {group.prs.map((pr, i) => (
          <div
            key={pr.number}
            className={`flex items-center gap-3 p-[14px_18px] ${
              i < group.prs.length - 1 ? "border-border-subtle border-b" : ""
            }`}
          >
            <StatusBadge tone={pullRequestStatusTone(pr.status)}>
              {pr.status}
            </StatusBadge>
            <div className="min-w-0 flex-1">
              <div className="text-sidebar-primary truncate text-[13.5px] font-semibold">
                {pr.title}{" "}
                <span className="text-text-faint font-medium">
                  #{pr.number}
                </span>
              </div>
              <div className="text-muted-foreground mt-0.5 text-xs">
                {pr.author} · updated {pr.updated}
              </div>
            </div>
            <ExternalLink
              className="text-text-faint size-3.5 shrink-0"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
