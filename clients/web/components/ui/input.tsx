import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const isSearch = type === "search";
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className,
            { "pl-8": isSearch },
          )}
          ref={ref}
          {...props}
        />
        {isSearch && (
          <SearchIcon
            size={16}
            className="text-muted absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none"
          />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
