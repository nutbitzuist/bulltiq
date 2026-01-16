import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "success" | "default";
    size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center font-bold
      border-3 border-black
      transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none
    `;

        const variants = {
            primary: `
        bg-primary text-black
        shadow-brutal-md
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
        active:translate-x-1 active:translate-y-1 active:shadow-none
      `,
            secondary: `
        bg-surface text-black
        shadow-brutal-md
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
        active:translate-x-1 active:translate-y-1 active:shadow-none
      `,
            outline: `
        bg-transparent text-black
        hover:bg-primary/10
      `,
            danger: `
        bg-danger text-white
        shadow-brutal-md
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
        active:translate-x-1 active:translate-y-1 active:shadow-none
      `,
            success: `
        bg-success text-white
        shadow-brutal-md
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
        active:translate-x-1 active:translate-y-1 active:shadow-none
      `,
            default: `
        bg-white text-black
        shadow-brutal-md
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm
        active:translate-x-1 active:translate-y-1 active:shadow-none
      `,
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
