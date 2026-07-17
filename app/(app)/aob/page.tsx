"use client";

import { useState } from "react";

import { AOBPostCard } from "@/components/aob/aob-post-card";
import {
  NewPostDialog,
  type NewPostValues,
} from "@/components/aob/new-post-dialog";
import { AppShell } from "@/components/layout/app-shell";
import { CURRENT_USER } from "@/lib/fixtures/engineers";
import { AOB_POSTS } from "@/lib/fixtures/aob";
import type { AOBPost } from "@/types/aob";

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function AOBPage() {
  const [posts, setPosts] = useState<AOBPost[]>(AOB_POSTS);

  function handleCreate(values: NewPostValues) {
    setPosts((prev) => [
      {
        id: `aob-${Date.now()}`,
        author: CURRENT_USER.name,
        initials: CURRENT_USER.initials,
        date: formatToday(),
        tag: values.tag,
        title: values.title,
        body: values.body,
      },
      ...prev,
    ]);
  }

  return (
    <AppShell title="AOB">
      <div className="max-w-[760px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Any Other Business</h2>
          <NewPostDialog onCreate={handleCreate} />
        </div>
        <div className="flex flex-col gap-3.5">
          {posts.map((post) => (
            <AOBPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
