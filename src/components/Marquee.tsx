"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  speed?: number;
}

export function Marquee({ className, speed = 30 }: MarqueeProps) {
  const t = useTranslations("marquee");
  const items = t("items");

  // Double the content for seamless loop
  const content = `${items} • ${items} • `;

  return (
    <div
      className={cn(
        "relative overflow-hidden py-6 lg:py-8 border-y border-border bg-muted/30",
        className
      )}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        <span className="text-fluid-xl lg:text-fluid-2xl font-heading tracking-wider text-foreground/60 pr-4">
          {content}
        </span>
        <span className="text-fluid-xl lg:text-fluid-2xl font-heading tracking-wider text-foreground/60 pr-4">
          {content}
        </span>
      </motion.div>
    </div>
  );
}
