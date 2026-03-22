import * as React from "react";

import { cn } from "../../lib/utils";

const Container = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mx-auto w-full max-w-[1180px] px-4 md:px-8", className)} {...props} />
));

Container.displayName = "Container";

const Grid = React.forwardRef(({ className, cols = 3, ...props }, ref) => {
  const variants = {
    2: "grid gap-4 md:grid-cols-2",
    3: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
    4: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
  };

  return <div ref={ref} className={cn(variants[cols] || variants[3], className)} {...props} />;
});

Grid.displayName = "Grid";

const Stack = React.forwardRef(({ className, size = "md", ...props }, ref) => {
  const gaps = {
    sm: "grid gap-2",
    md: "grid gap-4",
    lg: "grid gap-6",
  };

  return <div ref={ref} className={cn(gaps[size] || gaps.md, className)} {...props} />;
});

Stack.displayName = "Stack";

export { Container, Grid, Stack };
