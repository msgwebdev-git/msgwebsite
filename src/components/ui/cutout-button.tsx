import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CutoutButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "filled" | "outline";
}

function CutoutButton({
  variant = "outline",
  className,
  children,
  ...props
}: CutoutButtonProps) {
  const isFilled = variant === "filled";

  return (
    <a
      className={cn(
        "group relative block overflow-hidden",
        isFilled && "bg-foreground",
        className
      )}
      {...props}
    >
      {/* Red expand overlay — grows from top-right corner on hover */}
      <span
        className={cn(
          "absolute top-0 right-0 w-full h-full bg-primary",
          "origin-top-right scale-0 group-hover:scale-100",
          "transition-transform duration-500 ease-out"
        )}
      />

      <span
        className={cn(
          "relative z-10 block px-8 py-4 pr-[calc(2rem+28px)]",
          "text-fluid-base font-heading tracking-wider",
          "transition-colors duration-300",
          isFilled
            ? "text-background group-hover:text-white"
            : "text-foreground group-hover:text-white"
        )}
      >
        {children}
      </span>

      {isFilled ? (
        /* Cutout mask for filled variant */
        <span className="absolute top-0 right-0 w-[28px] h-[28px] bg-background z-20 pointer-events-none" />
      ) : (
        /* Border lines for outline variant */
        <>
          <span className="absolute left-0 top-0 bottom-0 w-px bg-foreground z-20" />
          <span className="absolute top-0 left-0 h-px bg-foreground z-20" style={{ right: 28 }} />
          <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground z-20" />
          <span className="absolute right-0 bottom-0 w-px bg-foreground z-20" style={{ top: 28 }} />
          <span className="absolute right-0 w-[28px] h-px bg-foreground z-20" style={{ top: 28 }} />
          <span className="absolute top-0 h-[28px] w-px bg-foreground z-20" style={{ right: 28 }} />
        </>
      )}

      {/* Red square with arrow */}
      <span
        className={cn(
          "absolute top-[2px] right-[2px] w-[22px] h-[22px] bg-primary z-30",
          "flex items-center justify-center pointer-events-none"
        )}
      >
        <ArrowUpRight className="w-3 h-3 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export { CutoutButton };
