import { useState } from 'react';

import { cn } from '@/lib/utils';

type DropAreaProps = {
  onDrop: () => void;
};

export default function DropArea({ onDrop }: DropAreaProps) {
  const [isVisible, setIsVisible] = useState(false);

  function showArea() {
    setIsVisible(true);
  }

  function hideArea() {
    setIsVisible(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsVisible(false);
    onDrop();
  }

  return (
    <div
      onDrop={handleDrop}
      onDragEnter={showArea}
      onDragLeave={hideArea}
      className={cn(
        'h-4 bg-gray-300 rounded-xl border border-dashed border-gray-500 transition-all duration-300 ease-in-out',
        {
          'py-8': isVisible,
          'opacity-0': !isVisible,
        },
      )}
    ></div>
  );
}
