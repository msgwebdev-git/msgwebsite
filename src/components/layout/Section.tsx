"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  /**
   * Vertical padding size
   */
  spacing?: "sm" | "md" | "lg" | "xl" | "section";
  /**
   * Full height section (viewport height)
   */
  fullHeight?: boolean;
  id?: string;
}

export function Section({
  children,
  className,
  spacing = "section",
  fullHeight = false,
  id,
}: SectionProps) {
  const spacingClasses = {
    sm: "py-fluid-md",
    md: "py-fluid-lg",
    lg: "py-fluid-xl",
    xl: "py-fluid-xl",
    section: "py-fluid-section",
  };

  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        fullHeight && "min-h-screen-safe flex flex-col justify-center",
        className
      )}
    >
      {children}
    </section>
  );
}
