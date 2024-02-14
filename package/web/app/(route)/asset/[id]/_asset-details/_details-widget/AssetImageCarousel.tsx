import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ImagePlus } from 'lucide-react';

type AssetImageCarouselProps = {
  attachmentPath: string[];
  handleOpenUploadImage: () => void;
};

export default function AssetImageCarousel({
  attachmentPath,
  handleOpenUploadImage,
}: AssetImageCarouselProps) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

  return (
    <Carousel opts={{ align: 'start' }} className="mx-12 w-full max-w-sm">
      <CarouselContent className="flex min-h-20 flex-1 items-center">
        <CarouselItem className="flex h-full cursor-pointer items-center justify-center md:basis-1/2 lg:basis-1/3">
          <div
            onClick={handleOpenUploadImage}
            className="flex h-full w-full flex-1 items-center justify-center rounded-md border-2 border-dashed border-gray-400 py-4"
          >
            <ImagePlus />
          </div>
        </CarouselItem>
        {attachmentPath.map(attachment => (
          <CarouselItem key={attachment} className="md:basis-1/2 lg:basis-1/3">
            <Image
              alt={attachment}
              src={`${baseUrl}/asset${attachment}`}
              width={200}
              height={800}
              className="flex flex-1 rounded-md object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
