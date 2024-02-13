import { useState, useTransition } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CheckCircle, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useAssetStore } from '@/hooks/use-asset.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateAsset } from '@/lib/actions/asset';
import { UpdateAsset } from '@/lib/schemas/asset';

type AssetCoverProps = {
  open: boolean;
  onClose: () => void;
};

export default function AssetCover({ open, onClose }: AssetCoverProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const asset = useAssetStore.getState().asset;

  const [openAssetAddCoverImage, setOpenAssetAddCoverImage] = useState(false);
  const [currentCover, setCurrentCover] = useState(asset?.assetCover || '');
  const [assetCover, setAssetCover] = useState('');

  function updateCoverImage() {
    startTransition(() => {
      if (!user || user.id || !asset) {
        toast.error('Session expired!');
        return;
      }

      const updatedCoverImage: UpdateAsset = {
        assetCover,
      };

      toast.promise(updateAsset(user.id, asset.id, updatedCoverImage), {
        loading: 'Updating cover image...',
        success: 'Cover image updated!',
        error: 'Failed to update cover image',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  function handleOpenAssetAddCoverImage() {
    setOpenAssetAddCoverImage(true);
  }

  function handleCloseAssetAddCoverImage() {
    setOpenAssetAddCoverImage(false);
  }

  function highlightImage(attachment: string) {
    if (assetCover === attachment) {
      setAssetCover('');
      return;
    }

    setAssetCover(attachment);
  }

  function handleUpdateCoverTemp() {
    setCurrentCover(assetCover);
  }

  return asset && isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <div className="flex items-center space-x-4 text-lg font-medium">
            <ImageIcon /> <span>Asset Cover</span>
          </div>
        </SheetHeader>
        <div className="flex flex-col space-y-4">
          <div
            onClick={handleOpenAssetAddCoverImage}
            className={cn(
              'cursor-pointer rounded-md border-2 border-dashed border-gray-400 px-4 py-16',
              {
                'py-4': currentCover !== '',
              },
            )}
          >
            {currentCover !== '' ? (
              <Image
                src={currentCover}
                alt={asset.name}
                width={400}
                height={200}
              />
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <ImageIcon size={24} />
                <span>Add Image</span>
              </div>
            )}
          </div>
          {asset.attachmentPath.length > 0 && (
            <div className="p-12">
              <Carousel opts={{ align: 'start' }} className="w-full max-w-sm">
                <CarouselContent>
                  {asset.attachmentPath.map(attachment => (
                    <CarouselItem
                      key={attachment}
                      onClick={() => highlightImage(attachment)}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="relative h-full">
                        {assetCover === attachment && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-green-500">
                              <CheckCircle />
                            </span>
                          </div>
                        )}
                        <Image
                          src={attachment}
                          alt={attachment}
                          width={400}
                          height={200}
                          className={cn('flex flex-1 rounded-md object-cover', {
                            'border-2 border-primary':
                              assetCover === attachment,
                          })}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
          {assetCover !== '' && (
            <div>
              <Button
                size="sm"
                className="w-full"
                onClick={handleUpdateCoverTemp}
              >
                Set As Cover
              </Button>
            </div>
          )}
          <Dialog
            open={openAssetAddCoverImage}
            onOpenChange={handleCloseAssetAddCoverImage}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hello</DialogTitle>
                <DialogDescription>World</DialogDescription>
                Hello Content
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <SheetFooter>
          <Button size="sm" variant="destructive" onClick={handleClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent>Mobile coming soon</DrawerContent>
    </Drawer>
  );
}
