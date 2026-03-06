"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FluidGridProps {
  children: ReactNode;
  className?: string;
  /**
   * Minimum width of each item before wrapping
   */
  minItemWidth?: "sm" | "md" | "lg" | "xl";
  /**
   * Gap between items
   */
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function FluidGrid({
  children,
  className,
  minItemWidth = "md",
  gap = "md",
}: FluidGridProps) {
  const minWidths = {
    sm: "min(100%, 250px)",
    md: "min(100%, 320px)",
    lg: "min(100%, 400px)",
    xl: "min(100%, 500px)",
  };

  const gaps = {
    xs: "gap-fluid-xs",
    sm: "gap-fluid-sm",
    md: "gap-fluid-md",
    lg: "gap-fluid-lg",
    xl: "gap-fluid-xl",
  };

  return (
    <div
      className={cn("grid", gaps[gap], className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidths[minItemWidth]}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
