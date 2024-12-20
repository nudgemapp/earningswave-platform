"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const CustomTabs = TabsPrimitive.Root;

const CustomTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex w-full border-b border-gray-200 dark:border-slate-700",
      className
    )}
    {...props}
  />
));
CustomTabsList.displayName = TabsPrimitive.List.displayName;

const CustomTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex-1",
      "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400",
      "hover:text-gray-700 dark:hover:text-gray-200",
      "focus:outline-none",
      "border-b-2 border-transparent",
      "transition-colors duration-200",
      "data-[state=active]:border-blue-500 dark:data-[state=active]:border-blue-400",
      "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400",
      className
    )}
    {...props}
  />
));
CustomTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const CustomTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4", className)}
    {...props}
  />
));
CustomTabsContent.displayName = TabsPrimitive.Content.displayName;

export { CustomTabs, CustomTabsList, CustomTabsTrigger, CustomTabsContent };
