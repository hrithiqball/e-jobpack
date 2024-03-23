import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AssetStatus, AssetType, User } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

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
  SheetTitle,
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
import { createAsset } from '@/data/asset.action';
import {
  CreateAsset,
  CreateAssetForm,
  CreateAssetFormSchema,
  CreateAssetSchema,
} from '@/lib/schemas/asset';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type AddAssetProps = {
  open: boolean;
  onClose: () => void;
  userList: User[];
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
};

export default function AddAssetModal({
  open,
  onClose,
  userList,
  assetStatusList,
  assetTypeList,
}: AddAssetProps) {
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
        <SheetHeader>
          <SheetTitle>Create Asset</SheetTitle>
        </SheetHeader>
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
                            .filter(user => user.role !== 'TECHNICIAN')
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
            type="submit"
            form="create-asset-form"
            variant="outline"
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
        <DrawerHeader> Create Asset </DrawerHeader>
        Mobile Coming soon
        <DrawerFooter>
          <Button onClick={handleClose}> Close </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
