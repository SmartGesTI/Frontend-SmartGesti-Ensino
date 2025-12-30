import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        google:
          "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700",
        // Botões de Ação do Usuário (Verde - Gradiente) - Salvar, Criar, Enviar
        // Padrão 1: Preenchido
        aiAction:
          "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
        // Padrão 2: Outline sem cor + Cor no hover (para cards)
        aiActionOutlineHover:
          "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400",
        // Padrão 3: Outline Colorido
        aiActionOutline:
          "border-2 border-green-500 text-green-600 dark:text-green-400 bg-transparent hover:bg-green-50 dark:hover:bg-green-950/50 hover:border-green-600 dark:hover:border-green-500",
        // Botões de Edição (Azul para Roxo - Gradiente) - Editar
        // Padrão 1: Preenchido
        aiEdit:
          "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl",
        // Padrão 2: Outline sem cor + Cor no hover (para cards) - Azul
        aiEditOutlineHover:
          "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400",
        // Padrão 3: Outline Colorido - Azul
        aiEditOutline:
          "border-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-600 dark:hover:border-blue-500",
        // Botões de Ação da IA (Roxo - Cor EducaIA) - Analisar com IA, Gerar Relatório, Preview
        // Padrão 1: Preenchido
        aiPrimary:
          "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 relative overflow-hidden",
        // Padrão 2: Outline sem cor + Cor no hover (para cards - Preview)
        aiPrimaryOutlineHover:
          "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400",
        // Padrão 3: Outline Colorido
        aiPrimaryOutline:
          "border-2 border-purple-500 text-purple-600 dark:text-purple-400 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-600 dark:hover:border-purple-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
