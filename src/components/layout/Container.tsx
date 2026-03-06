"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * fluid - 96% width, max 2400px, centered
   * full - 100% width with padding
   * narrow - max 1200px for text content
   */
  variant?: "fluid" | "full" | "narrow";
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

export function Container({
  children,
  className,
  variant = "fluid",
  as: Component = "div",
}: ContainerProps) {
  const variants = {
    fluid: "container-fluid",
    full: "container-full",
    narrow: "container-fluid max-w-[1200px]",
  };

  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}
