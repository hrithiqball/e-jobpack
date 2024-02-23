import { Fragment, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useAssetStore } from '@/hooks/use-asset.store';
import {
  UpdateAssetSchema,
  UpdateAssetForm,
  UpdateAssetFormSchema,
} from '@/lib/schemas/asset';
import { updateAsset } from '@/lib/actions/asset';

type AssetDetailsFormProps = {
  onClose: () => void;
};

export default function AssetDetailsForm({ onClose }: AssetDetailsFormProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const { asset } = useAssetStore();

  const form = useForm<UpdateAssetForm>({
    resolver: zodResolver(UpdateAssetFormSchema),
    defaultValues: {
      name: asset?.name,
      description: asset?.description || '',
      tag: asset?.tag || '',
      location: asset?.location || '',
    },
  });

  function onSubmit(data: UpdateAssetForm) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      if (asset === null) {
        toast.error('Asset not found');
        return;
      }

      const validatedFields = UpdateAssetSchema.safeParse(data);

      if (validatedFields.success === false) {
        toast.error(validatedFields.error?.issues[0]?.message);
        return;
      }

      toast.promise(
        updateAsset(user.id, asset.id, { ...validatedFields.data }),
        {
          loading: 'Updating asset...',
          success: () => {
            onClose();
            router.refresh();
            return 'Asset updated';
          },
          error: 'Failed to update asset',
        },
      );
    });
  }

  return (
    <Fragment>
      <Form {...form}>
        <form id="update-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <Input type="text" {...field} />
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
                  <FormLabel>Description</FormLabel>
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
                  <FormLabel>Tag</FormLabel>
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          disabled={transitioning}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-form"
          variant="outline"
          disabled={transitioning}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
}
