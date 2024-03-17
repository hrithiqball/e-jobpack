import * as React from 'react';
import { cn } from '@/lib/utils';

import { Check, X, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  children?: React.ReactNode | string;
  showSelected?: boolean;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  children,
  showSelected,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter(i => i !== item));
  };

  return (
    <div className="space-y-4">
      {showSelected && (
        <div className="flex flex-wrap gap-1">
          {selected.map(item => (
            <Badge
              variant="secondary"
              key={item}
              className="mb-1 mr-1"
              onClick={() => handleUnselect(item)}
            >
              {item}
              <button
                className="focus:ring-ring ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-offset-2"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleUnselect(item);
                  }
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(item)}
              >
                <X className="text-muted-foreground h-3 w-3 hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between"
            onClick={() => setOpen(!open)}
          >
            {selected.length > 0 ? (
              <span>{selected.length} selected</span>
            ) : (
              children
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className={className}>
            <CommandInput placeholder="Search ..." />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter(item => item !== option.value)
                        : [...selected, option.value],
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { MultiSelect };
