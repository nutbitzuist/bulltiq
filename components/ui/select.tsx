import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        "w-full appearance-none px-4 py-3 pr-10 bg-white border-3 border-black",
                        "shadow-brutal-sm cursor-pointer",
                        "focus:outline-none focus:shadow-brutal-md focus:translate-x-[-2px] focus:translate-y-[-2px]",
                        "transition-all duration-150",
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-text-secondary" />
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
