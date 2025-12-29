import * as React from "react"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"

export interface AIButtonProps extends ButtonProps {
  /**
   * Se true, adiciona animação de gradiente ao botão
   */
  shimmer?: boolean
  /**
   * Se true, adiciona animação de pulso no ícone
   */
  iconPulse?: boolean
}

/**
 * Componente de botão especializado para ações de IA
 * Inclui efeitos visuais especiais como shimmer e animação de ícone
 */
const AIButton = React.forwardRef<HTMLButtonElement, AIButtonProps>(
  ({ className, shimmer = false, iconPulse = false, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden group",
          shimmer && "ai-button-gradient-animated",
          className
        )}
        {...props}
      >
        <span className={cn("relative flex items-center justify-center gap-2", iconPulse && "[&_svg]:animate-icon-pulse")}>
          {children}
        </span>
      </Button>
    )
  }
)
AIButton.displayName = "AIButton"

export { AIButton }
