import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import Link from 'next/link';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300',
  {
    variants: {
      variant: {
        default:
          'bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-50/90',
        destructive:
          'bg-rose-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-600 dark:text-gray-50 dark:hover:bg-red-900/90',
        outline:
          'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80',
        ghost:
          'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
        link: 'text-gray-900 underline-offset-4 hover:underline hover:text-blue-500 dark:text-gray-50 dark:hover:text-blue-300',
      },
      size: {
        default: 'h-8 px-8',
        sm: 'h-8 rounded-md px-2 text-xs',
        lg: 'h-12 rounded-md px-8',
        withIcon: 'h-8 px-3 space-x-2',
        icon: 'h-8 w-8 p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  asChild?: boolean;
  asLink?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asLink = false,
      asChild = false,
      href,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), {
          'px-0': asLink,
        })}
        ref={ref}
        {...props}
      >
        {href ? (
          <Link href={href} className="w-full">
            <span
              className={cn(buttonVariants({ variant, size, className }), {
                'px-8 hover:bg-teal-900 dark:hover:bg-teal-50/90': asLink,
              })}
              {...props}
            />
          </Link>
        ) : (
          props.children
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

const ButtonIcon = ({
  onClick,
  startContent,
  children,
}: {
  onClick?: () => void;
  startContent?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Button size="icon" className="space-x-2 px-2" onClick={onClick}>
      {startContent}
      {children}
    </Button>
  );
};

export { Button, buttonVariants, ButtonIcon };
