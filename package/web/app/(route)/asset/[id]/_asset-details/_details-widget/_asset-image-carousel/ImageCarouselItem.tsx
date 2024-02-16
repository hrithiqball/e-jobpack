import { useState } from 'react';
import Image from 'next/image';

import { CarouselItem } from '@/components/ui/carousel';
import { Trash } from 'lucide-react';
import { useAssetStore } from '@/hooks/use-asset.store';
import { toast } from 'sonner';
import { deleteAssetImage } from '@/lib/actions/asset';

type AssetImageCarouselProps = {
  attachment: string;
};

export default function ImageCarouselItem({
  attachment,
}: AssetImageCarouselProps) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

  const [isHover, setIsHover] = useState(false);

  const { asset } = useAssetStore();

  function handleHoverEnter() {
    setIsHover(true);
  }

  function handleHoverLeave() {
    setIsHover(false);
  }

  function handleDeleteImage() {
    if (!asset) return;

    toast.promise(deleteAssetImage(attachment, asset), {
      loading: 'Deleting image...',
      success: 'Image deleted',
      error: 'Failed to delete image',
    });
  }

  return (
    <CarouselItem
      key={attachment}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      className="cursor-pointer md:basis-1/2 lg:basis-1/3"
    >
      <div className="relative flex">
        {isHover && (
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-red-500">
            <Trash onClick={handleDeleteImage} />
          </div>
        )}
        <Image
          alt={attachment}
          src={`${baseUrl}/asset${attachment}`}
          width={200}
          height={800}
          className="flex flex-1 rounded-md object-cover"
        />
      </div>
    </CarouselItem>
  );
}
