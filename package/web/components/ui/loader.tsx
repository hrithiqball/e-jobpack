import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Loader2
        className={cn('my-28 size-8 animate-spin text-primary/60', className)}
      />
    </div>
  );
};
