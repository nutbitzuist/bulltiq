import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "danger" | "warning" | "info" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-surface border-black text-text-primary",
            success: "bg-success/20 border-success text-success",
            danger: "bg-danger/20 border-danger text-danger",
            warning: "bg-primary/20 border-primary text-text-primary",
            info: "bg-accent-blue/20 border-accent-blue text-accent-blue",
            outline: "bg-transparent border-black/30 text-text-secondary hover:bg-surface",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold",
                    "border-2 rounded-none",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
