import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceLibStore } from '@/hooks/use-maintenance-lib.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUserStore } from '@/hooks/use-user.store';
import {
  CreateMaintenanceForm,
  CreateMaintenanceFormSchema,
} from '@/lib/schemas/maintenance';
import { cn } from '@/lib/utils';
import { baseServerUrl } from '@/public/constant/url';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type RecreateMaintenanceProps = {
  open: boolean;
  onClose: () => void;
};

export default function RecreateMaintenance({
  open,
  onClose,
}: RecreateMaintenanceProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { maintenanceLib } = useMaintenanceLibStore();
  const { userList } = useUserStore();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const form = useForm<CreateMaintenanceForm>({
    resolver: zodResolver(CreateMaintenanceFormSchema),
  });

  function onSubmit(data: CreateMaintenanceForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      console.log(data);
    });
  }

  function handleClose() {
    onClose();
  }

  if (!maintenanceLib) return null;
  if (!userList) return <Loader />;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Recreate Maintenance</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="recreate-maintenance-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                        <SelectValue placeholder="Choose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="space-x-4">
                      {userList
                        .filter(user => user.role === 'SUPERVISOR')
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              {user.image ? (
                                <Image
                                  src={`${baseServerUrl}/user/${user.image}`}
                                  alt={user.name}
                                  width={20}
                                  height={20}
                                  className="size-5 rounded-full"
                                />
                              ) : (
                                <div className="flex size-5 items-center justify-center rounded-full bg-teal-800">
                                  <p className="text-xs text-white">
                                    {user.name.substring(0, 1).toUpperCase()}
                                  </p>
                                </div>
                              )}
                              <p>{user.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                        Pick a date <sup className="text-red-500">*</sup>
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
            {/* TODO: refer maintenance/_component/_maintenance-tab/_recreate/recreate-checklist-cell.tsx */}
            {/* TODO: refer helper/add-checklist.tsx */}
            {/* <MultiSelect >Select Asset</MultiSelect> */}
          </form>
        </Form>
        <SheetFooter>
          <Button
            type="submit"
            form="recreate-maintenance-form"
            variant="outline"
            disabled={transitioning}
          >
            Recreate
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Recreate Maintenance</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Recreate</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
