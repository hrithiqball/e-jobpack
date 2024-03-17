import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerContent,
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
import Loader from '@/components/ui/loader';
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
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useUserStore } from '@/hooks/use-user.store';
import {
  UpdateMaintenanceForm,
  UpdateMaintenanceFormSchema,
} from '@/lib/schemas/maintenance';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateMaintenanceDetails } from '@/data/maintenance.action';
import { useCurrentUser } from '@/hooks/use-current-user';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type EditMaintenanceProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditMaintenance({
  open,
  onClose,
}: EditMaintenanceProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { maintenance } = useMaintenanceStore();
  const { userList } = useUserStore();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [maintenanceMemberValue, setMaintenanceMemberValue] = useState(
    userList
      .filter(user => user.role === 'TECHNICIAN')
      .map(user => ({
        ...user,
        checked: maintenance?.maintenanceMember.some(
          member => member.userId === user.id,
        ),
      })),
  );

  const form = useForm<UpdateMaintenanceForm>({
    resolver: zodResolver(UpdateMaintenanceFormSchema),
    defaultValues: {
      id: maintenance?.id || '',
      approvedById: maintenance?.approvedById || '',
    },
  });

  function handleCheckChange(userId: string) {
    const updatedMemberList = maintenanceMemberValue.map(user =>
      user.id === userId ? { ...user, checked: !user.checked } : user,
    );

    setMaintenanceMemberValue(updatedMemberList);
  }

  function onSubmit(data: UpdateMaintenanceForm) {
    startTransition(() => {
      if (!maintenance) {
        toast.error('Maintenance not found');
        return;
      }

      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!dateRange) {
        toast.error('Date is required');
        return;
      }

      const memberList = maintenanceMemberValue
        .filter(user => user.checked)
        .map(user => user.id);

      toast.promise(
        updateMaintenanceDetails(maintenance.id, data, dateRange, memberList),
        {
          loading: 'Updating maintenance...',
          success: 'Maintenance updated',
          error: 'Failed to update maintenance',
        },
      );
    });
  }

  function handleClose() {
    onClose();
  }

  if (!maintenance) return <Loader />;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{maintenance.id}</SheetTitle>
        </SheetHeader>
        <div className="my-4 space-y-4">
          <Form {...form}>
            <form
              id="update-maintenance-main"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col space-y-4">
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
                      <FormLabel>
                        Person in Charge <sup className="text-red-500">*</sup>
                      </FormLabel>
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
                            .filter(
                              user =>
                                user.role !== 'TECHNICIAN' && user.id !== '-99',
                            )
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
                                    <div className="flex size-5 items-center justify-center rounded-full bg-gray-500">
                                      <span className="text-xs text-white">
                                        {user.name.substring(0, 1)}
                                      </span>
                                    </div>
                                  )}
                                  <span>{user.name}</span>
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
                        variant="outline"
                        className={cn(
                          'h-10 w-full justify-start p-4 text-left font-normal dark:bg-gray-800',
                          { 'text-gray-400': !dateRange },
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
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
                <div className="flex flex-col space-y-2">
                  <Label>Member</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 w-full justify-start p-4 text-left font-normal dark:bg-gray-800"
                      >
                        Members
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {maintenanceMemberValue.map(user => (
                        <DropdownMenuCheckboxItem
                          key={user.id}
                          checked={user.checked}
                          onCheckedChange={() => {
                            handleCheckChange(user.id);
                          }}
                          onSelect={e => e.preventDefault()}
                        >
                          <div className="flex items-center space-x-1">
                            {user.image ? (
                              <Image
                                src={`${baseServerUrl}/user/${user.image}`}
                                alt={user.name}
                                width={6}
                                height={6}
                                className="size-5 rounded-full"
                              />
                            ) : (
                              <div className="flex size-5 items-center justify-center rounded-full bg-gray-400">
                                <p className="text-xs">
                                  {user.name.substring(0, 1)}
                                </p>
                              </div>
                            )}
                            <span>{user.name}</span>
                          </div>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button
            form="update-maintenance-main"
            type="submit"
            variant="outline"
            disabled={transitioning}
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
          <DrawerTitle>{maintenance.id}</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
