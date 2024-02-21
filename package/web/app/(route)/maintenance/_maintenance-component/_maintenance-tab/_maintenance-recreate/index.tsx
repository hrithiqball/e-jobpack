import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { MaintenanceChecklist, MaintenanceItem } from '@/types/maintenance';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useUserStore } from '@/hooks/use-user.store';
import { recreateMaintenance } from '@/lib/actions/maintenance';

import MaintenanceRecreateAssetCell from './MaintenanceRecreateAssetCell';
import MaintenanceRecreateChecklistCell from './MaintenanceRecreateChecklistCell';

const MaintenanceRecreateFormSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'Maintenance ID is required' })
    .refine(value => !/\s/.test(value), {
      message: 'Maintenance ID cannot contain spaces',
    }),
  startDate: z.date({ required_error: 'Start date is required' }),
  deadline: z.date().optional().nullable(),
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
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();
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
    defaultValues: {
      startDate: new Date(),
    },
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

  function handleClose() {
    form.reset();
    onClose();
  }

  function onSubmit(data: MaintenanceRecreateForm) {
    const newMaintenanceChecklist: MaintenanceChecklist[] = assetChecklist.map(
      asset => {
        const target = maintenance.checklist.find(
          m => m.assetId === asset.assetId,
        );

        const taskList = target?.task.map(t => ({
          id: uuidv4(),
          taskActivity: t.taskActivity,
          description: t.description,
          taskType: t.taskType,
          listChoice:
            t.taskType === 'MULTIPLE_SELECT' || t.taskType === 'SINGLE_SELECT'
              ? t.listChoice
              : [],
          taskOrder: t.taskOrder,
        }));

        return {
          assetId: asset.assetId!,
          taskList:
            asset.library === 'prev' || asset.library === null
              ? taskList
              : null,
          checklistLibraryId:
            asset.library === 'default' ? null : asset.library,
        };
      },
    );

    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session expired');
        return;
      }

      toast.promise(recreateMaintenance(user, data, newMaintenanceChecklist), {
        loading: 'Recreating maintenance...',
        success: () => {
          handleClose();
          return 'Maintenance successfully recreated!';
        },
        error: 'Failed to recreate maintenance',
      });
    });
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
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
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              size="sm"
                              color="primary"
                              className="flex w-full items-center justify-start"
                            >
                              <div className="flex flex-1 items-center justify-between text-small">
                                <div className="flex items-center space-x-2">
                                  <CalendarIcon size={18} />
                                  <span>Start Date</span>
                                </div>
                                <span>
                                  {field.value &&
                                    dayjs(field.value).format('DD/MM/YYYY')}
                                </span>
                              </div>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={date => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                          type="button"
                          variant="outline"
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
          <Button
            variant="outline"
            size="sm"
            disabled={transitioning}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="recreate-form"
            variant="outline"
            size="sm"
            color="primary"
            disabled={transitioning}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader>Recreate Maintenance</DrawerHeader>
        Mobile coming soon
        <DrawerFooter>
          <Button onClick={handleClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
