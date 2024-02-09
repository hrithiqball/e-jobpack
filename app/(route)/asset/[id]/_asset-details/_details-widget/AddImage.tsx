import { ChangeEvent, useState } from 'react';

import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button as ShadButton } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useMediaQuery } from '@/hooks/use-media-query';

type AddImageProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddImage({ open, onClose }: AddImageProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [image, setImage] = useState<string | null>(null);

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImage(null);
  }

  function handleClose() {
    clearImage();
    onClose();
  }

  return isDesktop ? (
    <Modal hideCloseButton backdrop="blur" isOpen={open}>
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <div className="mx-4 flex flex-1 flex-col space-y-4">
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-md border border-dashed border-gray-400 px-4 py-8',
              { 'py-4': image != null },
            )}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Preview" className="rounded-md" />
            ) : (
              <div className="flex items-center">
                <ImagePlus />
                Upload Image
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <div className="flex items-center">
              <Input id="picture" type="file" onChange={handleImageUpload} />
              {image && (
                <ShadButton
                  variant="destructive"
                  size={'icon'}
                  onClick={clearImage}
                >
                  <Trash size={18} />
                </ShadButton>
              )}
            </div>
          </div>
        </div>
        <ModalFooter>
          <Button variant="faded" size="sm" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            onClick={handleClose}
          >
            Close
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
