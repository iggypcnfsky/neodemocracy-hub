import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const classes = [
      "h-9 w-full rounded-md bg-neutral-950/60 border border-neutral-800 px-3 text-sm text-neutral-200 placeholder:text-neutral-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return <input ref={ref} className={classes} {...props} />;
  }
);
Input.displayName = "Input";

export default Input;


