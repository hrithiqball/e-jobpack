import { Fragment, useTransition } from 'react';

import { Button } from '@nextui-org/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateAsset,
  UpdateAssetForm,
  UpdateAssetFormSchema,
} from '@/lib/schemas/asset';
import { Asset } from '@/types/asset';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from 'sonner';
import { updateAsset } from '@/lib/actions/asset';
import { useRouter } from 'next/navigation';

type AssetDetailsFormProps = {
  asset: Asset;
  onClose: () => void;
};

export default function AssetDetailsForm({
  asset,
  onClose,
}: AssetDetailsFormProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();
  const router = useRouter();

  const form = useForm<UpdateAssetForm>({
    resolver: zodResolver(UpdateAssetFormSchema),
    defaultValues: {
      name: asset.name,
      description: asset.description || '',
      tag: asset.tag || '',
      location: asset.location || '',
    },
  });

  function onSubmit(data: UpdateAssetForm) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      const validatedFields = UpdateAsset.safeParse(data);

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
          size="sm"
          variant="faded"
          color="danger"
          isDisabled={transitioning}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="update-form"
          size="sm"
          variant="faded"
          color="primary"
          isDisabled={transitioning}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
}
