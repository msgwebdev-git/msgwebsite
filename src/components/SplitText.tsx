"use client";

import { useMemo } from "react";
import { motion, MotionValue, useTransform, useSpring } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  scrollProgress: MotionValue<number>;
  start: number;
  end: number;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "chars" | "words";
}

function AnimatedItem({
  text,
  scrollProgress,
  enterAt,
  fullAt,
  addSpace,
}: {
  text: string;
  scrollProgress: MotionValue<number>;
  enterAt: number;
  fullAt: number;
  addSpace: boolean;
}) {
  const opacity = useTransform(scrollProgress, [enterAt, fullAt], [0, 1]);
  const y = useTransform(scrollProgress, [enterAt, fullAt], [40, 0]);
  const smoothOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 30 });

  return (
    <motion.span
      className="inline-block"
      style={{ opacity: smoothOpacity, y: smoothY, marginRight: addSpace ? "0.3em" : 0 }}
    >
      {text === " " ? "\u00A0" : text}
    </motion.span>
  );
}

export default function SplitText({
  text,
  className = "",
  style,
  scrollProgress,
  start,
  end,
  tag: Tag = "span",
  splitBy = "chars",
}: SplitTextProps) {
  const items = useMemo(() => {
    if (splitBy === "words") return text.split(" ");
    return text.split("");
  }, [text, splitBy]);

  const range = end - start;

  return (
    <Tag className={className} style={style}>
      {items.map((item, i) => {
        const stagger = range / items.length;
        const enterAt = start + i * stagger;
        const fullAt = Math.min(enterAt + stagger * 3, end);

        return (
          <AnimatedItem
            key={`${i}-${item}`}
            text={item}
            scrollProgress={scrollProgress}
            enterAt={enterAt}
            fullAt={fullAt}
            addSpace={splitBy === "words" && i < items.length - 1}
          />
        );
      })}
    </Tag>
  );
}
