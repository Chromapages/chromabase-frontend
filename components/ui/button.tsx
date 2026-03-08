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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[15px] shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 aria-invalid:ring-destructive/20 aria-invalid:border-destructive select-none",
    ].join(" "),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] shadow-[0_2px_10px_-3px_rgba(249,115,22,0.3)] font-display",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98] shadow-[0_2px_10px_-3px_rgba(255,59,48,0.25)]",
                outline:
                    "border border-border bg-transparent hover:bg-secondary active:scale-[0.98] text-foreground font-display",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-muted active:scale-[0.98] font-display",
                ghost:
                    "text-foreground/80 hover:bg-muted/70 hover:text-foreground active:scale-[0.98]",
                link:
                    "text-primary underline-offset-4 hover:underline p-0 h-auto",
                glass:
                    "glass-sm text-foreground hover:bg-white/30 active:scale-[0.98] border-white/20",
            },
            size: {
                default: "h-10 px-5 py-2 text-[14px] rounded-[10px]",
                xs: "h-7 gap-1 rounded-lg px-2 text-[11px] [&_svg:not([class*='size-'])]:size-3",
                sm: "h-8 rounded-[9px] gap-1.5 px-3 text-[13px]",
                lg: "h-12 rounded-xl px-6 text-[16px] font-semibold",
                icon: "size-10 rounded-[10px]",
                "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-8 rounded-[9px]",
                "icon-lg": "size-12 rounded-xl",
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
