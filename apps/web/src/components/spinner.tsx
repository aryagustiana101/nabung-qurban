import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "~/lib/utils";

export const spinnerVariants = cva(
  "relative inline-block aspect-square transform-gpu",
  {
    variants: {
      variant: {
        default: "[&>div]:bg-foreground",
        primary: "[&>div]:bg-primary",
        secondary: "[&>div]:bg-secondary",
        destructive: "[&>div]:bg-destructive",
        muted: "[&>div]:bg-muted-foreground",
      },
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Spinner({
  variant,
  className,
  size = "default",
}: {
  className?: string;
  variant?: VariantProps<typeof spinnerVariants>["variant"];
  size?: VariantProps<typeof spinnerVariants>["size"] | number;
}) {
  return (
    <div
      style={
        typeof size === "number" ? { width: size, height: size } : undefined
      }
      className={cn(
        typeof size === "string"
          ? spinnerVariants({ variant, size })
          : spinnerVariants({ variant }),
        className,
      )}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={String(i)}
          className="absolute top-[4.4%] left-[46.5%] h-[24%] w-[7%] origin-[center_190%] animate-spinner rounded-full opacity-[0.1] will-change-transform"
          style={{
            transform: `rotate(${i * 30}deg)`,
            animationDelay: `${(i * 0.083).toFixed(3)}s`,
          }}
        />
      ))}
    </div>
  );
}
