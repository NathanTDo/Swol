import * as React from "react";
import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva("flex-row items-center justify-center rounded-md", {
  variants: {
    variant: {
      default: "bg-blue-600",
    },
    size: {
      default: "h-10 px-4 py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const buttonTextVariants = cva("text-center font-medium", {
  variants: {
    variant: {
      default: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

type ButtonTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof buttonTextVariants>;

const ButtonText = React.forwardRef<
  React.ElementRef<typeof Text>,
  ButtonTextProps
>(({ className, variant, ...props }, ref) => {
  return (
    <Text
      className={cn(buttonTextVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});
ButtonText.displayName = "ButtonText";

export { Button, ButtonText };
