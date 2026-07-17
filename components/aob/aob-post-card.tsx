import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AOBPost } from "@/types/aob";

export interface AOBPostCardProps {
  post: AOBPost;
}

export function AOBPostCard({ post }: AOBPostCardProps) {
  return (
    <SectionCard className="p-[18px_20px]">
      <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
        <ProfileAvatar initials={post.initials} size="sm" />
        <div className="text-[13px] font-semibold">{post.author}</div>
        <div className="text-muted-foreground text-xs">{post.date}</div>
        <StatusBadge tone="open" className="ml-auto">
          {post.tag}
        </StatusBadge>
      </div>
      <div className="mb-1 text-[15px] font-semibold">{post.title}</div>
      <div className="text-text-label text-[13.5px] leading-relaxed">
        {post.body}
      </div>
    </SectionCard>
  );
}
