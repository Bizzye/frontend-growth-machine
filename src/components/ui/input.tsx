import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", id, label, ...props }, ref) => {
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <input
          id={id}
          type={type}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:scheme-dark",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
