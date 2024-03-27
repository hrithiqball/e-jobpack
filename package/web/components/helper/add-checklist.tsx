import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState, useTransition } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAssetStore } from '@/hooks/use-asset.store';
import { useGetChecklistLibraryList } from '@/data/checklist-library.query';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useGetAsset } from '@/data/asset.query';
import { Tooltip } from '@nextui-org/react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import { createChecklists } from '@/data/checklist.action';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

type AddChecklistProps = {
  open: boolean;
  onClose: () => void;
  assets: string[];
};

export default function AddChecklist({
  open,
  onClose,
  assets,
}: AddChecklistProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { assetList } = useAssetStore();
  const { maintenance } = useMaintenanceStore();

  const [selected, setSelected] = useState<string[]>([]);
  const [checklistValues, setChecklistValues] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const updatedValues: { [key: string]: string } = {};
    selected.forEach(assetId => {
      updatedValues[assetId] = 'default';
    });
    setChecklistValues(updatedValues);
  }, [selected]);

  const assetOptions = assetList
    .filter(asset => !assets.includes(asset.id))
    .map(asset => ({
      value: asset.id,
      label: asset.name,
    }));

  function handleClose() {
    onClose();
  }

  function handleUpdate() {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!maintenance) {
        toast.error('Maintenance not found');
        return;
      }

      const checklist: {
        assetId: string;
        checklistLibId: string | undefined;
      }[] = [];

      for (const key in checklistValues) {
        if (key in checklistValues) {
          const value = checklistValues[key];
          checklist.push({
            assetId: key,
            checklistLibId: value === 'default' ? undefined : value,
          });
        }
      }

      toast.promise(createChecklists(checklist, user.id, maintenance.id), {
        loading: 'Adding checklist...',
        success: res => {
          console.log(res); // TODO: add checklist to store for optimistic update
          handleClose();
          return 'Checklist added';
        },
        error: 'Failed to add checklist',
      });
    });
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add Checklist</SheetTitle>
        </SheetHeader>
        <MultiSelect
          options={assetOptions}
          selected={selected}
          onChange={setSelected}
          className="w-full"
        >
          Select Asset...
        </MultiSelect>
        {selected.length > 0 && (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Asset</TableCell>
                <TableCell>Checklist</TableCell>
              </TableRow>
              {selected.map(item => (
                <AssetSelection
                  key={item}
                  assetId={item}
                  checklistValue={checklistValues[item]!}
                  setChecklistValue={(value: string) =>
                    setChecklistValues(prevState => ({
                      ...prevState,
                      [item]: value,
                    }))
                  }
                />
              ))}
            </TableBody>
          </Table>
        )}
        <SheetFooter>
          <Button
            variant="outline"
            disabled={selected.length === 0 || transitioning}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </SheetFooter>
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

function AssetSelection({
  assetId,
  checklistValue,
  setChecklistValue,
}: {
  assetId: string;
  checklistValue: string;
  setChecklistValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: checklistLibList,
    error: checklistLibError,
    isLoading: checklistLoading,
  } = useGetChecklistLibraryList(assetId);

  const {
    data: asset,
    error: assetError,
    isLoading: assetLoading,
  } = useGetAsset(assetId);

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleCloseMenu() {
    setOpen(false);
  }

  const selectedChecklist = checklistLibList?.find(
    checklist => checklist.id === checklistValue,
  );

  if (checklistLibError) return <span>{checklistLibError.message}</span>;
  if (assetError) return <span>{assetError.message}</span>;

  return (
    <TableRow>
      <TableCell>
        {assetLoading ? <p>Loading...</p> : <p>{asset?.name}</p>}
      </TableCell>
      <TableCell>
        <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
          <DropdownMenuTrigger>
            <Tooltip content={selectedChecklist?.title || 'Default'}>
              <Button variant="outline" size="sm" onClick={handleOpenMenu}>
                {selectedChecklist ? (
                  <p>
                    {selectedChecklist.title.length > 10
                      ? `${selectedChecklist.title.slice(0, 10)}...`
                      : selectedChecklist.title}
                  </p>
                ) : (
                  'Default'
                )}
              </Button>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={checklistValue}
              onValueChange={setChecklistValue}
            >
              <DropdownMenuRadioItem value="default">
                Default
              </DropdownMenuRadioItem>
              {checklistLoading ? (
                <p>Loading</p>
              ) : (
                checklistLibList?.map(checklist => (
                  <DropdownMenuRadioItem
                    key={checklist.id}
                    value={checklist.id}
                  >
                    {checklist.title}
                  </DropdownMenuRadioItem>
                ))
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
