import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionContextType {
  type?: "single" | "multiple"
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const AccordionContext = React.createContext<AccordionContextType>({})

interface AccordionProps {
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  children: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue || (type === "multiple" ? [] : "")
    )
    const controlledValue = value !== undefined ? value : internalValue
    const handleValueChange = onValueChange || setInternalValue

    return (
      <AccordionContext.Provider value={{ type, value: controlledValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    const isOpen = context.type === "multiple"
      ? Array.isArray(context.value) && context.value.includes(value)
      : context.value === value

    const handleOpenChange = (open: boolean) => {
      if (!context.onValueChange) return

      if (context.type === "multiple") {
        const currentValue = Array.isArray(context.value) ? context.value : []
        const newValue = open
          ? [...currentValue, value]
          : currentValue.filter((v) => v !== value)
        context.onValueChange(newValue)
      } else {
        context.onValueChange(open ? value : "")
      }
    }

    return (
      <CollapsiblePrimitive.Root
        open={isOpen}
        onOpenChange={handleOpenChange}
        className={cn("border-b border-gray-200 dark:border-gray-700", className)}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Root>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  children: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:no-underline [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
  </CollapsiblePrimitive.Trigger>
))
AccordionTrigger.displayName = CollapsiblePrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </CollapsiblePrimitive.Content>
))
AccordionContent.displayName = CollapsiblePrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
