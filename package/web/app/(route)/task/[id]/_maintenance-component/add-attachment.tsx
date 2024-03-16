import { useState, useCallback, FormEvent, Fragment } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';

import { ImagePlus, Replace } from 'lucide-react';
import { toast } from 'sonner';

import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

import { uploadMaintenanceImage } from '@/lib/actions/maintenance';
import { cn } from '@/lib/utils';

import MaintenanceAddAttachmentDialog from './add-attachment-dialog';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type MaintenanceAddAttachmentProps = {
  open: boolean;
  onClose: () => void;
};
export default function MaintenanceAddAttachment({
  open,
  onClose,
}: MaintenanceAddAttachmentProps) {
  const { maintenance } = useMaintenanceStore();

  const [filename, setFilename] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(
    null,
  );
  const [
    openMaintenanceAddAttachmentDialog,
    setOpenMaintenanceAddAttachmentDialog,
  ] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file?.type.split('/')[0] !== 'image') {
      toast.error('File type should be an image');
      return;
    }

    if (file) {
      setFile(file);
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB');
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFilename(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file || !maintenance) {
      return;
    }

    const formData = new FormData();
    formData.append('maintenanceId', maintenance.id);
    formData.append('file', file);

    toast.promise(uploadMaintenanceImage(maintenance, formData), {
      loading: 'Uploading image...',
      success: 'Image uploaded!',
      error: 'Failed to upload image',
    });
  }

  function handleOpenMaintenanceAddAttachmentDialog(
    checklistId: string | null,
  ) {
    setSelectedChecklist(checklistId);
    setOpenMaintenanceAddAttachmentDialog(true);
  }

  function handleCloseMaintenanceAddAttachmentDialog() {
    setOpenMaintenanceAddAttachmentDialog(false);
  }

  function handleClose() {
    onClose();
  }

  return (
    maintenance && (
      <Fragment>
        <Sheet open={open} onOpenChange={handleClose}>
          <SheetContent className="space-y-4">
            <SheetHeader>
              <SheetTitle>Maintenance Attachment</SheetTitle>
            </SheetHeader>
            <div
              {...getRootProps()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 px-4 py-16',
                {
                  'py-4': filename !== '',
                },
              )}
            >
              <form id="maintenance-attachment-form" onSubmit={onSubmit}>
                <input
                  id="picture"
                  type="file"
                  name="file"
                  accept=".png"
                  {...getInputProps()}
                />
              </form>
              {filename ? (
                <Image
                  src={filename}
                  alt="Preview"
                  height={200}
                  width={300}
                  className="rounded-md"
                />
              ) : (
                <div
                  className={cn('flex items-center space-x-4', {
                    'animate-bounce': isDragActive,
                  })}
                >
                  {isDragActive ? <Replace /> : <ImagePlus />}
                  <span>
                    {isDragActive
                      ? 'Drop the files here'
                      : 'Drag & drop or browse'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-row-reverse">
              <Button
                type="submit"
                form="maintenance-attachment-form"
                variant="outline"
              >
                Upload
              </Button>
            </div>
            <div className="space-y-2">
              <span>General Attachment</span>
              <div className="px-12">
                <Carousel opts={{ align: 'start' }} className="w-full max-w-sm">
                  <CarouselContent>
                    <CarouselItem
                      className="cursor-pointer md:basis-1/2 lg:basis-1/3"
                      onClick={() =>
                        handleOpenMaintenanceAddAttachmentDialog(null)
                      }
                    >
                      <div className="flex h-full w-full flex-1 items-center justify-center rounded-md border-2 border-dashed border-gray-400 py-4">
                        <ImagePlus />
                      </div>
                    </CarouselItem>
                    {maintenance.attachmentPath.map(attachment => (
                      <CarouselItem
                        key={attachment}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="relative">
                          <Image
                            src={`${baseServerUrl}/maintenance/${attachment}`}
                            alt={attachment}
                            width={100}
                            height={100}
                            className="rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
            {/* <input
              type="text"
              value={Test}
              onChange={e => setTest(e.target.value)}
            /> */}
            {maintenance.checklist.map(checklist => (
              <div key={checklist.id} className="space-y-2">
                <span>{checklist.asset.name}</span>
                <div className="px-12">
                  <Carousel
                    opts={{ align: 'start' }}
                    className="w-full max-w-sm"
                  >
                    <CarouselContent>
                      <CarouselItem className="cursor-pointer md:basis-1/2 lg:basis-1/3">
                        <div
                          className="relative flex h-full w-full flex-1 items-center justify-center rounded-md border-2 border-dashed border-gray-400 py-4"
                          onClick={() =>
                            handleOpenMaintenanceAddAttachmentDialog(
                              checklist.id,
                            )
                          }
                        >
                          <ImagePlus />
                        </div>
                      </CarouselItem>
                      {checklist.attachmentPath.map(attachment => (
                        <CarouselItem
                          key={attachment}
                          className="md:basis-1/2 lg:basis-1/3"
                        >
                          <div className="relative h-full">
                            <Image
                              src={`${baseServerUrl}/maintenance/${attachment}`}
                              alt={attachment}
                              width={400}
                              height={200}
                              className="flex flex-1 rounded-md object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            ))}
          </SheetContent>
        </Sheet>
        <MaintenanceAddAttachmentDialog
          open={openMaintenanceAddAttachmentDialog}
          onClose={handleCloseMaintenanceAddAttachmentDialog}
          checklistId={selectedChecklist}
        />
      </Fragment>
    )
  );
}
