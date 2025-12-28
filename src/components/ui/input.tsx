import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, required, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border-2 bg-background px-4 py-2.5 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-input hover:border-blue-400/50 focus:border-blue-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errorMessage}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
