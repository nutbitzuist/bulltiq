import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "w-full px-4 py-3 bg-white border-3 border-black",
                        "shadow-brutal-sm",
                        "focus:outline-none focus:shadow-brutal-md focus:translate-x-[-2px] focus:translate-y-[-2px]",
                        "transition-all duration-150",
                        "placeholder:text-text-secondary/60",
                        icon && "pl-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";

// Search Input variant
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "icon">>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                icon={<Search className="w-5 h-5" />}
                className={className}
                {...props}
            />
        );
    }
);

SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
