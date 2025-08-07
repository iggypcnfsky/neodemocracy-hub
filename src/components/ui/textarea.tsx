import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 6, ...props }, ref) => {
    const classes = [
      "w-full rounded-md bg-neutral-950/60 border border-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return <textarea ref={ref} rows={rows} className={classes} {...props} />;
  }
);
Textarea.displayName = "Textarea";

export default Textarea;


