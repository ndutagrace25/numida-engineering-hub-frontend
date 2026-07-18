import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import { formatShortDate } from "@/lib/format-date";
import type { AOBItem } from "@/types/aob";

export interface AOBPostCardProps {
  post: AOBItem;
}

export function AOBPostCard({ post }: AOBPostCardProps) {
  return (
    <SectionCard className="p-[18px_20px]">
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <ProfileAvatar initials={post.createdBy?.initials ?? "?"} size="sm" />
        <div className="text-[13px] font-semibold">
          {post.createdBy?.displayName ?? "Unknown"}
        </div>
        <div className="text-muted-foreground text-xs">
          {formatShortDate(post.createdAt)}
        </div>
      </div>
      <div className="mb-1 text-[15px] font-semibold">{post.title}</div>
      {post.description && (
        <div className="text-text-label text-[13.5px] leading-relaxed">
          {post.description}
        </div>
      )}
      {post.externalUrl && (
        <a
          href={post.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary focus-visible:ring-ring mt-1.5 inline-block rounded text-[13px] font-semibold hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          Learn more ↗
        </a>
      )}
    </SectionCard>
  );
}
