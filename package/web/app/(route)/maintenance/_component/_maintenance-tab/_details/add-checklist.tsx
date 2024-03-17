import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

const frameworks = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

type AddChecklistProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddChecklist({ open, onClose }: AddChecklistProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [selected, setSelected] = useState<string[]>([]);

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Checklist</SheetTitle>
        </SheetHeader>
        <MultiSelect
          options={frameworks}
          selected={selected}
          onChange={setSelected}
          className="w-full"
        >
          Select Framework...
        </MultiSelect>
        {selected.map(item => (
          <div key={item}>{item}</div>
        ))}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Checklist</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
