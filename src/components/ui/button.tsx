import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[44px] min-w-[44px] font-display transform-gpu backface-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-fire hover:shadow-fire-lg active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-muted hover:text-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        fire: "bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-fire hover:shadow-fire-lg active:scale-95 animate-glow-pulse",
        gold: "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-gold active:scale-95 gold-shimmer",
        glass: "glass-card active:scale-95 hover:border-primary/50 hover:shadow-fire",
        hero: "bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-fire-lg hover:shadow-[0_0_50px_hsl(18_100%_60%/0.6)] active:scale-95 text-base md:text-lg px-8 py-4 rounded-2xl font-bold tracking-wide magnetic-border",
        heroOutline: "border-2 border-primary/50 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary hover:shadow-fire active:scale-95 text-base md:text-lg px-8 py-4 rounded-2xl font-bold tracking-wide",
        neon: "bg-transparent border border-primary/50 text-primary neon-text hover:bg-primary/10 active:scale-95",
        magnetic: "magnetic-border active:scale-95 text-foreground",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
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
