import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-primary border-primary/20 text-primary-foreground shadow-sm",
        secondary:
          "bg-secondary/50 border-border/50 text-secondary-foreground backdrop-blur-sm",
        destructive:
          "bg-destructive/10 border-destructive/20 text-destructive dark:bg-destructive/20",
        outline:
          "border-border/60 bg-transparent text-foreground/80 hover:bg-accent hover:text-accent-foreground",
        glass:
          "glass-sm border-white/20 text-foreground shadow-sm",
        success:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      },
      size: {
        default: "px-2 py-0.5",
        sm: "px-1.5 py-0 text-[9px]",
        lg: "px-3 py-1 text-[11px]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
