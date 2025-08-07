import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = [
    "rounded-lg border border-neutral-800 bg-neutral-950/60 text-neutral-200",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ["px-4 py-3 border-b border-neutral-800", className ?? ""].join(" ");
  return <div className={classes} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const classes = ["text-sm font-semibold", className ?? ""].join(" ");
  return <h3 className={classes} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ["p-4", className ?? ""].join(" ");
  return <div className={classes} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const classes = ["px-4 py-3 border-t border-neutral-800", className ?? ""].join(" ");
  return <div className={classes} {...props} />;
}


