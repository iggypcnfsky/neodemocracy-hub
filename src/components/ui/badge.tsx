import * as React from "react";

type BadgeVariant = "default" | "success" | "warning" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantToClass: Record<BadgeVariant, string> = {
  default: "bg-neutral-800 text-neutral-200 border border-neutral-700",
  success: "bg-emerald-900/40 text-emerald-200 border border-emerald-800",
  warning: "bg-amber-900/40 text-amber-200 border border-amber-800",
  outline: "bg-transparent text-neutral-300 border border-neutral-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const classes = [
    "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
    variantToClass[variant],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...props} />;
}

export default Badge;


