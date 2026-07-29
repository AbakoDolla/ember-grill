import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/0.2)] hover:bg-primary/90 hover:shadow-[0_10px_24px_hsl(var(--primary)/0.28)] active:translate-y-px",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-foreground/20 bg-transparent text-foreground hover:border-foreground/45 hover:bg-foreground/5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-muted",
        link: "h-auto min-h-0 px-0 text-primary underline-offset-4 hover:underline",
        fire: "bg-primary text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/0.2)] hover:bg-primary/90 hover:shadow-[0_10px_24px_hsl(var(--primary)/0.28)] active:translate-y-px",
        gold: "bg-accent text-accent-foreground hover:bg-accent/85",
        glass: "border border-border bg-card text-foreground shadow-sm hover:border-primary/35 hover:bg-background",
        hero: "rounded-xl bg-primary px-8 py-4 text-base text-primary-foreground shadow-[0_12px_26px_hsl(var(--primary)/0.25)] hover:bg-primary/90 hover:shadow-[0_16px_32px_hsl(var(--primary)/0.3)] active:translate-y-px",
        heroOutline: "rounded-xl border border-foreground/25 bg-transparent px-8 py-4 text-base text-foreground hover:border-foreground/50 hover:bg-foreground/5",
        neon: "border border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
        magnetic: "border border-border bg-card text-foreground hover:border-primary/40",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 min-h-9 rounded-lg px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
