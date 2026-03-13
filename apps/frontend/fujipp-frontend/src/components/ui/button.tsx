import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] tracking-wide uppercase",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgb(121_135_172/0.35)] active:bg-[var(--btn-primary-active)] active:translate-y-0 active:shadow-none",
        secondary:
          "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] hover:bg-[var(--btn-secondary-hover)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(80_80_80/0.3)] active:bg-[var(--btn-secondary-active)] active:translate-y-0 active:shadow-none",
        destructive:
          "bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] hover:bg-[var(--btn-danger-hover)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(225_77_77/0.35)] active:bg-[var(--btn-danger-active)] active:translate-y-0 active:shadow-none",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "text-[var(--text-primary)] hover:bg-[var(--accent)]/10 active:bg-[var(--accent)]/20",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-7 text-base has-[>svg]:px-5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
