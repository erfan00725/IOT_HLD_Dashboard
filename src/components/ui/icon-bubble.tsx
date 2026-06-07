import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface IconBubbleProps {
  icon: LucideIcon;
  /** Tailwind classes for background + text colour. */
  colorClass: string;
  size?: "sm" | "md";
  strokeWidth?: number;
}

/**
 * IconBubble — rounded square container with a centred Lucide icon.
 *
 * size="sm"  → size-8  (32 px)
 * size="md"  → size-9  (36 px)  (default)
 */
export function IconBubble({ icon: Icon, colorClass, size = "md", strokeWidth = 1.8 }: IconBubbleProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-xl",
        size === "sm" ? "size-8" : "size-9",
        colorClass
      )}
    >
      <Icon className="size-4" strokeWidth={strokeWidth} aria-hidden="true" />
    </div>
  );
}
