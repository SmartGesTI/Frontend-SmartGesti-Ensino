import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none hover:border-blue-400/50 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
