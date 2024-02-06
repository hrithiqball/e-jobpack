import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@nextui-org/react';
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
import { toast } from 'sonner';

import { useUserStore } from '@/hooks/use-user.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  CreateMaintenance,
  CreateMaintenanceSchema,
} from '@/lib/schemas/maintenance';

import AssetChoiceCell from '@/app/(route)/maintenance/_maintenance-component/_maintenance-tab/_maintenance-create/MaintenanceCreateAssetCell';
import ChecklistChoiceCell from '@/app/(route)/maintenance/_maintenance-component/_maintenance-tab/_maintenance-create/MaintenanceCreateChecklistCell';

type MaintenanceCreateProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceCreate({
  open,
  onClose,
}: MaintenanceCreateProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const userList = useUserStore.getState().userList;

  const [assetChecklist, setAssetChecklist] = useState<
    { assetId: string | null; title: string }[]
  >([]);

  const form = useForm<CreateMaintenance>({
    resolver: zodResolver(CreateMaintenanceSchema),
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

  function onSubmit(data: CreateMaintenance) {
    toast.info(`Form submitted ${JSON.stringify(data, null, 2)}`);
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="text-medium font-medium">
          Create New Maintenance
        </SheetHeader>
        <div className="my-4 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    {asset.assetId ? (
                      <ChecklistChoiceCell assetId={asset.assetId} />
                    ) : (
                      <span>no</span>
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
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <SheetFooter>
          <Button variant="faded" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="faded"
            size="sm"
            color="primary"
            onClick={form.handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onClose}>
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
