import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "../lib/utils";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, ...props }, ref) => {
  return (
    <TextInput
      className={cn(
        "h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-800",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
