import * as React from 'react';

import { cn } from '@/lib/utils';

//https://github.com/shadcn-ui/ui/pull/504#issuecomment-1883379209

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-950 dark:bg-gray-800 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
