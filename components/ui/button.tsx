import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/*
 * Button — Swiss Modernism 2.0 × Apple HIG
 *
 * Principles:
 *  - Crisp edges with precise border-radius (--radius-md = 10px)
 *  - 150ms transitions — Apple micro-interaction timing
 *  - Primary = Apple Blue, never overdecorated
 *  - Ghost / outline for secondary actions — whitespace does the work
 */
const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
        "transition-all duration-150 cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[15px] shrink-0 [&_svg]:shrink-0",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "select-none",
    ].join(" "),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-[0_1px_3px_rgba(0,122,255,0.3)]",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80 shadow-[0_1px_3px_rgba(255,59,48,0.25)] focus-visible:ring-destructive/40",
                outline:
                    "border border-border bg-background hover:bg-muted/70 hover:border-border/80 active:bg-muted text-foreground shadow-xs",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
                ghost:
                    "text-foreground/80 hover:bg-muted/70 hover:text-foreground active:bg-muted",
                link:
                    "text-primary underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                default: "h-9 px-4 py-2 text-[13px] rounded-[10px] has-[>svg]:px-3",
                xs: "h-6 gap-1 rounded-lg px-2 text-[11px] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-8 rounded-[9px] gap-1.5 px-3 text-[13px] has-[>svg]:px-2.5",
                lg: "h-10 rounded-xl px-5 text-[15px] has-[>svg]:px-4",
                icon: "size-9 rounded-[10px]",
                "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-8 rounded-[9px]",
                "icon-lg": "size-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
