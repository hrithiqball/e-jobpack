import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@nextui-org/react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

import { useMediaQuery } from '@/hooks/use-media-query';
import { MaintenanceItem } from '@/types/maintenance';
import { useUserStore } from '@/hooks/use-user.store';
import { useAssetStore } from '@/hooks/use-asset.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PackageX } from 'lucide-react';
import { useGetChecklistLibraryList } from '@/data/checklist-library';

const MaintenanceRecreateFormSchema = z.object({
  id: z.string().min(1, { message: 'Maintenance ID is required' }),
  // startDate: z.date({ required_error: 'Start date is required' }),
  // deadline: z.date().optional().nullable(),
  approvedById: z
    .string()
    .min(1, { message: 'Person in charge is required for approval' }),
});

type MaintenanceRecreateForm = z.infer<typeof MaintenanceRecreateFormSchema>;

type MaintenanceRecreateProps = {
  open: boolean;
  onClose: () => void;
  maintenance: MaintenanceItem;
};

export default function MaintenanceRecreate({
  open,
  onClose,
  maintenance,
}: MaintenanceRecreateProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const userList = useUserStore.getState().userList;

  const [assetChecklist, setAssetChecklist] = useState<
    { assetId: string | null; library: string | null }[]
  >(
    maintenance.checklist.map(checklist => ({
      assetId: checklist.assetId,
      library: null,
    })),
  );

  const form = useForm<MaintenanceRecreateForm>({
    resolver: zodResolver(MaintenanceRecreateFormSchema),
  });

  function addAssetChecklist() {
    setAssetChecklist(prev => [...prev, { assetId: null, library: null }]);
  }

  function handleSelectedAssetChange(
    updatedAsset: { assetId: string | null; library: string | null },
    index: number,
  ) {
    setAssetChecklist(prev => {
      const updatedAssetChecklist = [...prev];
      updatedAssetChecklist[index] = updatedAsset;
      return updatedAssetChecklist;
    });
  }

  function handleChecklistChange(
    updatedAsset: { assetId: string | null; library: string | null },
    index: number,
  ) {
    setAssetChecklist(prev => {
      const updatedAssetChecklist = [...prev];
      updatedAssetChecklist[index] = updatedAsset;
      return updatedAssetChecklist;
    });
  }

  function onSubmit(data: MaintenanceRecreateForm) {
    console.log('submit', data);
    console.log(assetChecklist);

    const newMaintenanceChecklist = assetChecklist.map(asset => {
      return {
        assetId: asset.assetId!,
        checklist:
          asset.library === 'prev' || asset.library === null
            ? maintenance.checklist
            : null,
        checklistLibraryId: asset.library === 'default' ? null : asset.library,
      };
    });

    console.log(newMaintenanceChecklist);
    // TODO: send data to server
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>Recreate Maintenance</SheetHeader>
        <div className="my-4 space-y-4">
          <Form {...form}>
            <form id="recreate-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Maintenance ID </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="e.g. MT-02"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approvedById"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Person In Charge </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Person In Charge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="space-x-4">
                          {userList.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Table>
                  <TableHeader>
                    <TableHead> Asset </TableHead>
                    <TableHead> Checklist </TableHead>
                  </TableHeader>
                  <TableBody>
                    {assetChecklist.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <MaintenanceRecreateAssetCell
                            asset={asset}
                            onAssetChange={updatedAsset =>
                              handleSelectedAssetChange(updatedAsset, index)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {asset.assetId && (
                            <MaintenanceRecreateChecklistCell
                              asset={{
                                assetId: asset.assetId,
                                library: asset.library,
                              }}
                              isInPreviousMaintenance={maintenance.checklist.some(
                                checklist =>
                                  checklist.assetId === asset.assetId,
                              )}
                              onChecklistChange={library =>
                                handleChecklistChange(library, index)
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Button
                          variant="faded"
                          size="sm"
                          onClick={addAssetChecklist}
                          className="w-full"
                        >
                          Add Checklist
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button variant="faded" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="recreate-form"
            variant="faded"
            size="sm"
            color="primary"
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>Recreate Maintenance</DrawerHeader>
        Mobile coming soon
        <DrawerFooter>
          <Button onClick={onClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type MaintenanceRecreateAssetCellProps = {
  asset: { assetId: string | null; library: string | null };
  onAssetChange: (asset: {
    assetId: string | null;
    library: string | null;
  }) => void;
};

function MaintenanceRecreateAssetCell({
  asset,
  onAssetChange,
}: MaintenanceRecreateAssetCellProps) {
  const assetList = useAssetStore.getState().assetList;

  const [open, setOpen] = useState(false);
  const [assetValue, setAssetValue] = useState(asset.assetId || 'empty');
  const selectedAsset = assetList.find(asset => asset.id === assetValue);

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleValueChange(value: string) {
    setAssetValue(value);
    if (value === 'prev') {
      onAssetChange({ assetId: null, library: null });
      return;
    }
    const selectedAsset = assetList.find(asset => asset.id === value)!;
    const inferredAsset = {
      assetId: selectedAsset.id,
      library: null,
    };

    onAssetChange(inferredAsset);
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button
          variant="faded"
          size="sm"
          color="primary"
          onClick={handleOpenMenu}
        >
          {selectedAsset ? selectedAsset.name : 'Choose Asset'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={assetValue}
          onValueChange={handleValueChange}
        >
          {assetList
            .filter(a => a.id !== asset.assetId)
            .map(asset => (
              <DropdownMenuRadioItem key={asset.id} value={asset.id}>
                {asset.name}
              </DropdownMenuRadioItem>
            ))}
          {assetList.filter(a => a.id !== asset.assetId).length === 0 && (
            <div className="m-1 flex items-center space-x-2">
              <PackageX size={18} />
              <span className="text-red-600">No other asset can be added</span>
            </div>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type MaintenanceRecreateChecklistCellProps = {
  asset: { assetId: string; library: string | null };
  isInPreviousMaintenance: boolean;
  onChecklistChange: (asset: {
    assetId: string | null;
    library: string | null;
  }) => void;
};

function MaintenanceRecreateChecklistCell({
  asset,
  isInPreviousMaintenance,
  onChecklistChange,
}: MaintenanceRecreateChecklistCellProps) {
  const [checklistValue, setChecklistValue] = useState(
    isInPreviousMaintenance ? 'prev' : 'default',
  );
  const [open, setOpen] = useState(false);

  function handleCloseMenu() {
    setOpen(false);
  }

  function handleOpenMenu() {
    setOpen(true);
  }

  function handleValueChange(value: string) {
    setChecklistValue(value);
    if (value === 'prev') {
      onChecklistChange({ assetId: asset.assetId, library: null });
      return;
    }

    onChecklistChange({ assetId: asset.assetId, library: value });
  }

  const {
    data: checklistLibraryList,
    error: fetchError,
    isLoading,
  } = useGetChecklistLibraryList(asset.assetId);

  const selectedChecklist = checklistLibraryList?.find(
    checklist => checklist.id === checklistValue,
  );

  if (fetchError) return <span>{fetchError.message}</span>;
  return (
    <DropdownMenu open={open} onOpenChange={handleCloseMenu}>
      <DropdownMenuTrigger>
        <Button
          variant="faded"
          size="sm"
          color="primary"
          onClick={handleOpenMenu}
        >
          {checklistValue === 'prev' && <span> Previous Checklist </span>}
          {checklistValue === 'default' && <span> Default </span>}
          {checklistValue !== 'prev' &&
            checklistValue !== 'default' &&
            selectedChecklist && <span>{selectedChecklist.title}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={checklistValue}
          onValueChange={handleValueChange}
        >
          {isInPreviousMaintenance && (
            <DropdownMenuRadioItem value="prev">
              Previous Checklist
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            checklistLibraryList?.map(checklist => (
              <DropdownMenuRadioItem key={checklist.id} value={checklist.id}>
                {checklist.title}
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
