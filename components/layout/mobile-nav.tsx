"use client";

import { Menu } from "lucide-react";
import { Suspense, useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Off-canvas navigation drawer for viewports narrower than the sidebar's
 * own breakpoint. The imported design has no mobile layout to reference
 * (it's a fixed-width desktop shell), so this reuses the exact Sidebar
 * content/styling inside a standard slide-over drawer — the same visual
 * language, adapted with a conventional responsive pattern.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="lg:hidden"
          />
        }
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="gap-0 p-0 data-[side=left]:w-[232px] data-[side=left]:max-w-[85vw]"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Suspense fallback={null}>
          <Sidebar
            className="w-full min-w-0 border-r-0"
            onNavigate={() => setOpen(false)}
          />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}
