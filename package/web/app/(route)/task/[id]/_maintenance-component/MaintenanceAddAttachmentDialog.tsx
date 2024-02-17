import { FormEvent, useCallback, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Replace } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

type MaintenanceAddAttachmentDialogProps = {
  checklistId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceAddAttachmentDialog({
  checklistId,
  open,
  onClose,
}: MaintenanceAddAttachmentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const { maintenance } = useMaintenanceStore();

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
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('maintenanceId', maintenance.id);

    if (checklistId) {
      formData.append('checklistId', checklistId);
    }
  }

  function handleClose() {
    setFile(null);
    setFilename(null);
    onClose();
  }

  function handleUpload() {
    console.log('uploading', checklistId);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          {checklistId && (
            <DialogDescription>{`This attachment will be saved in ${checklistId}`}</DialogDescription>
          )}
        </DialogHeader>
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 px-4 py-16',
            {
              'py-4': filename,
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
                {isDragActive ? 'Drop the files here' : 'Drag & drop or browse'}
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
