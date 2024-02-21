import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { MaintenanceChecklist } from '@/types/maintenance';
import { useUserStore } from '@/hooks/use-user.store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import {
  CreateMaintenanceForm,
  CreateMaintenanceFormSchema,
} from '@/lib/schemas/maintenance';

import AssetChoiceCell from './MaintenanceCreateAssetCell';
import ChecklistChoiceCell from './MaintenanceCreateChecklistCell';

type MaintenanceCreateProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceCreate({
  open,
  onClose,
}: MaintenanceCreateProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { userList } = useUserStore();
  const {
    checklistSelected,
    addChecklistSelected,
    clearChecklistSelected,
    removeChecklistSelected,
  } = useMaintenanceStore();
  // CHECKPOINT: do this

  const [assetChecklist, setAssetChecklist] = useState<
    { assetId: string | null; title: string }[]
  >([]);

  const form = useForm<CreateMaintenanceForm>({
    resolver: zodResolver(CreateMaintenanceFormSchema),
  });

  function addAssetChecklist() {
    setAssetChecklist(prev => [...prev, { assetId: null, title: '' }]);
  }

  function handleSelectedAssetChange(
    updatedAsset: { assetId: string | null; title: string },
    index: number,
  ) {
    setAssetChecklist(prev => {
      const updatedAssetChecklist = [...prev];
      updatedAssetChecklist[index] = updatedAsset;
      return updatedAssetChecklist;
    });
  }

  function handleDeleteAssetChecklist(index: number) {
    setAssetChecklist(prev => {
      const updatedAssetChecklist = [...prev];
      updatedAssetChecklist.splice(index, 1);
      return updatedAssetChecklist;
    });
  }

  function handleDeleteSelectedChecklist(id: string) {
    removeChecklistSelected(id);
  }

  function onSubmit(data: CreateMaintenanceForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      console.log(assetChecklist);

      const checklists: MaintenanceChecklist[] = assetChecklist.map(
        checklist => {
          return {
            assetId: checklist.assetId,
            taskList: [],
            checklistLibraryId: null,
          };
        },
      );

      const newMaintenance = {
        ...data,
        checklists: assetChecklist,
      };

      console.log(newMaintenance);
    });
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader className="text-medium font-medium">
          Create New Maintenance
        </SheetHeader>
        <div className="my-4 space-y-4">
          <Form {...form}>
            <form
              id="create-maintenance-sheet-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance ID</FormLabel>
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
                      <FormLabel>Person In Charge</FormLabel>
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
                          {userList
                            .filter(
                              user =>
                                user.id !== '-99' &&
                                (user.role === 'ADMIN' ||
                                  user.role === 'SUPERVISOR'),
                            )
                            .map(user => (
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
              </div>
            </form>
          </Form>
          <Table>
            <TableHeader>
              <TableHead> Asset </TableHead>
              <TableHead> Checklist </TableHead>
            </TableHeader>
            <TableBody>
              {assetChecklist.map((asset, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <AssetChoiceCell
                      onAssetChange={updatedAsset =>
                        handleSelectedAssetChange(updatedAsset, index)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {asset.assetId && (
                      <ChecklistChoiceCell assetId={asset.assetId} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteAssetChecklist(index)}
                    >
                      <Trash size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {checklistSelected.map(checklist => (
                <TableRow key={checklist.id}>
                  <TableCell>
                    <AssetChoiceCell
                      onAssetChange={updatedAsset =>
                        handleSelectedAssetChange(updatedAsset, 1)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {checklist.assetId && (
                      <ChecklistChoiceCell assetId={checklist.assetId} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        handleDeleteSelectedChecklist(checklist.id)
                      }
                    >
                      <Trash size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <Button
                    size="sm"
                    onClick={addAssetChecklist}
                    className="w-full"
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            form="create-maintenance-sheet-form"
            size="sm"
            disabled={transitioning}
          >
            Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>Create New Maintenance</DrawerHeader>
        <div>Mobile coming soon</div>
        <DrawerFooter>
          <Button onClick={onClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
