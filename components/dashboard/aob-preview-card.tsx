import { DashboardWidgetCard } from "@/components/dashboard/dashboard-widget-card";
import type { AOBPost } from "@/types/aob";

export interface AOBPreviewCardProps {
  posts: AOBPost[];
}

export function AOBPreviewCard({ posts }: AOBPreviewCardProps) {
  return (
    <DashboardWidgetCard
      title="AOB"
      viewAllHref="/aob"
      viewAllLabel="All posts →"
    >
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div key={post.id}>
            <div className="text-[13px] font-semibold">{post.title}</div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              {post.author} · {post.date}
            </div>
          </div>
        ))}
      </div>
    </DashboardWidgetCard>
  );
}
