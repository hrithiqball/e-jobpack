import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DateRange } from 'react-day-picker';
import dayjs from 'dayjs';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { useUserStore } from '@/hooks/use-user.store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import {
  CreateMaintenanceForm,
  CreateMaintenanceFormSchema,
  CreateMaintenanceType,
} from '@/lib/schemas/maintenance';
import { createMaintenance } from '@/lib/actions/maintenance';

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
  const router = useRouter();

  const { userList } = useUserStore();
  const {
    checklistSelected,
    addChecklistSelected,
    clearChecklistSelected,
    removeChecklistSelected,
  } = useMaintenanceStore();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const form = useForm<CreateMaintenanceForm>({
    resolver: zodResolver(CreateMaintenanceFormSchema),
  });

  function onSubmit(data: CreateMaintenanceForm) {
    startTransition(() => {
      if (!user) {
        toast.error('Session expired');
        return;
      }

      if (!dateRange?.from) {
        toast.error('Date is required');
        return;
      }

      const checklist: { assetId: string; checklistId: string | null }[] =
        checklistSelected.map(checklist => {
          return {
            assetId: checklist.assetId!,
            checklistId: checklist.checklistId,
          };
        });

      const newMaintenance: CreateMaintenanceType = {
        ...data,
        checklist,
        startDate: dateRange.from,
        deadline: dateRange.to,
      };

      toast.promise(createMaintenance(user, newMaintenance), {
        loading: 'Creating maintenance...',
        success: () => {
          router.refresh();
          return 'Maintenance created';
        },
        error: 'Failed to create maintenance',
      });
    });
  }

  function handleClose() {
    form.reset();
    clearChecklistSelected();
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
                <div className="space-y-2">
                  <Label>Maintenance Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                          'h-10 w-full justify-start p-4 text-left font-normal dark:bg-gray-800',
                          !dateRange && 'text-gray-400',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {dayjs(dateRange.from).format('DD/MM/YYYY')} -{' '}
                              {dayjs(dateRange.to).format('DD/MM/YYYY')}
                            </>
                          ) : (
                            dayjs(dateRange.from).format('DD/MM/YYYY')
                          )
                        ) : (
                          <span>
                            Pick a date <sup className="text-red-500">*</sup>{' '}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  {!dateRange?.from && (
                    <span className="text-sm font-medium text-red-500">
                      Date is required
                    </span>
                  )}
                </div>
              </div>
            </form>
          </Form>
          <Table>
            <TableHeader>
              <TableHead> Asset </TableHead>
              <TableHead> Checklist </TableHead>
            </TableHeader>
            <TableBody>
              {checklistSelected.map(checklist => (
                <TableRow key={checklist.id}>
                  <TableCell>
                    <AssetChoiceCell checklist={checklist} />
                  </TableCell>
                  <TableCell>
                    {checklist.assetId && (
                      <ChecklistChoiceCell checklist={checklist} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeChecklistSelected(checklist.id)}
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
                    onClick={addChecklistSelected}
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
