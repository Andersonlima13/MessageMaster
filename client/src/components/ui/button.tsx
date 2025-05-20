import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-wider border-2 rounded-full transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-purple-600 hover:bg-purple-700 text-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-purple-600 bg-background hover:bg-purple-100 hover:text-purple-900 dark:border-purple-400 dark:hover:bg-purple-900 dark:hover:text-purple-100",
        secondary: "bg-purple-200 text-purple-900 hover:bg-purple-300 dark:bg-purple-800 dark:text-purple-100",
        ghost: "hover:bg-purple-100 hover:text-purple-900 dark:hover:bg-purple-900 dark:hover:text-purple-100",
        link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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