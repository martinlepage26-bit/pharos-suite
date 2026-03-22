import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-[1rem] border border-border bg-card/90 px-3.5 py-2.5 text-[0.86rem] text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export { Input };
