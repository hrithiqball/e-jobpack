import { Button } from '@/components/ui/button';
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  CreateContractorForm,
  CreateContractorFormSchema,
} from '@/lib/schemas/contractor.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContractorTypeStore } from '@/hooks/use-contractor-type-store';
import { Loader } from '@/components/ui/loader';

type AddContractorProps = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterContractor({
  open,
  onClose,
}: AddContractorProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { contractorTypes } = useContractorTypeStore();

  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [contractorTypeChoice, setContractorTypeChoice] = useState(
    contractorTypes?.map(type => ({ id: type.id, type: type.updatedById })),
  );

  useEffect(() => {
    if (!contractorTypes) return;

    setContractorTypeChoice(
      contractorTypes.map(type => ({ id: type.id, type: type.updatedById })),
    );
  }, [contractorTypes]);

  const form = useForm<CreateContractorForm>({
    resolver: zodResolver(CreateContractorFormSchema),
  });

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    if (file.type.split('/')[0] !== 'image') {
      toast.error('File type should be an image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size should be less than 2MB');
      return;
    }

    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setFilename(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function onSubmit(data: CreateContractorForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      console.log(file);

      console.log(data);
    });
  }

  function handleClose() {
    setFile(null);
    setFilename(null);
    onClose();
  }

  if (!contractorTypeChoice) {
    return <Loader />;
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Register Contractor</SheetTitle>
        </SheetHeader>
        {filename && (
          <div className="flex flex-col items-center justify-center">
            <Image src={filename} alt="preview" height={100} width={100} />
          </div>
        )}
        <div className="flex flex-col space-y-3">
          <Label>Icon</Label>
          <Input
            type="file"
            id="picture"
            accept=".png"
            onChange={handleIconChange}
          />
        </div>
        <Form {...form}>
          <form
            id="create-contractor-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractorTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contractor Type</FormLabel>
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
                        {contractorTypeChoice.map(choice => (
                          <SelectItem key={choice.id} value={choice.id}>
                            {choice.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button variant="outline" disabled={transitioning}>
            Register
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Register Contractor</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline">Register</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
