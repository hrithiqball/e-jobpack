'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverItem = ({
  onClick,
  startContent,
  children,
}: {
  onClick?: (e: React.MouseEvent) => void;
  startContent?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="group flex w-full justify-start space-x-2 px-2 hover:bg-gray-50 hover:text-teal-500"
    >
      <span className="group-hover:text-teal-500">{startContent}</span>
      <span className="pr-2 group-hover:text-teal-500">{children}</span>
    </Button>
  );
};

const PopoverItemDestructive = ({
  onClick,
  startContent,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  startContent?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="group flex w-full justify-start space-x-2 px-2 hover:bg-red-50 hover:text-red-500"
    >
      <span className="group-hover:text-red-500">{startContent}</span>
      <span className="pr-2 group-hover:text-red-500">{children}</span>
    </Button>
  );
};

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
};
