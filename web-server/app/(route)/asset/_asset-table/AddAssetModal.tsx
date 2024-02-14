import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AssetStatus, AssetType, User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { createAsset } from '@/lib/actions/asset';
import {
  CreateAsset,
  CreateAssetForm,
  CreateAssetFormSchema,
  CreateAssetSchema,
} from '@/lib/schemas/asset';

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
  userList: User[];
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
}

export default function AddAssetModal({
  open,
  onClose,
  userList,
  assetStatusList,
  assetTypeList,
}: AddAssetModalProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const user = useCurrentUser();

  const form = useForm<CreateAssetForm>({
    resolver: zodResolver(CreateAssetFormSchema),
  });

  function onSubmit(data: CreateAssetForm) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      const newAsset: CreateAsset = {
        ...data,
        createdById: user.id,
      };

      const validatedFields = CreateAssetSchema.safeParse(newAsset);

      if (!validatedFields.success) {
        if (
          validatedFields.error &&
          validatedFields.error.issues &&
          validatedFields.error.issues[0]
        ) {
          toast.error(validatedFields.error?.issues[0]?.message);
        }
        return;
      }

      toast.promise(createAsset(validatedFields.data), {
        loading: 'Creating asset',
        success: () => {
          router.refresh();
          handleClose();
          return 'Asset created successfully';
        },
        error: 'Failed to create asset',
      });
    });
  }

  function handleClose() {
    form.reset();
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader> Create Asset </SheetHeader>
        <div className="my-4 space-y-4">
          <Form {...form}>
            <form id="create-asset-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <sup className="text-red-500">*</sup>
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="text"
                          placeholder="e.g. Pump Filter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Description </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Tag </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Location </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personInChargeId"
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
                                {user.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Type of asset </FormLabel>
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
                          {assetTypeList.map(assetType => (
                            <SelectItem key={assetType.id} value={assetType.id}>
                              {assetType.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="statusId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Status </FormLabel>
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
                          {assetStatusList.map(status => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={transitioning}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            type="submit"
            form="create-asset-form"
            variant="outline"
            size="sm"
            color="primary"
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader> Create Asset </DrawerHeader>
        Mobile Coming soon
        <DrawerFooter>
          <Button onClick={handleClose}> Close </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
