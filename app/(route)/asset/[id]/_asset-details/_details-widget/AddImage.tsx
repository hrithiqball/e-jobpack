import { useState, useCallback, FormEvent } from 'react';
import Image from 'next/image';

import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Replace, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useAssetStore } from '@/hooks/use-asset.store';
import { uploadAssetImage } from '@/lib/actions/upload';

type AddImageProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddImage({ open, onClose }: AddImageProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const asset = useAssetStore.getState().asset;

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

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
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const uploadAssetImageWithId = uploadAssetImage.bind(
    null,
    asset || undefined,
  );

  function clearImage() {
    setImage(null);
  }

  function handleClose() {
    clearImage();
    onClose();
  }

  function customSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!image || !file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadAssetImageWithId(formData).then(() => handleClose());
  }

  return isDesktop ? (
    <Modal hideCloseButton backdrop="blur" isOpen={open}>
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <div className="mx-4 flex flex-1 flex-col space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 px-4 py-16',
              { 'py-4': image !== null },
            )}
          >
            <form id="asset-image-form" onSubmit={customSubmission}>
              <input
                id="picture"
                type="file"
                name="file"
                accept=".png"
                {...getInputProps()}
              />
            </form>
            {image ? (
              <Image
                src={image}
                alt="Preview"
                height={200}
                width={500}
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
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center">
              {image && (
                <Button
                  variant="faded"
                  color="danger"
                  startContent={<Trash size={18} />}
                  onClick={clearImage}
                  className="w-full"
                >
                  Clear Image
                </Button>
              )}
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="faded" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            // onClick={handleClose}
            isDisabled={!image}
            type="submit"
            form="asset-image-form"
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerFooter>
          <Button onClick={handleClose}>Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
