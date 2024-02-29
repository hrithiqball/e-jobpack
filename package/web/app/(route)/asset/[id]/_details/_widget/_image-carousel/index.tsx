import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ImagePlus } from 'lucide-react';

import ImageCarouselItem from './item';

type AssetImageCarouselProps = {
  attachmentPath: string[];
  handleOpenUploadImage: () => void;
};

export default function AssetImageCarousel({
  attachmentPath,
  handleOpenUploadImage,
}: AssetImageCarouselProps) {
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
          <ImageCarouselItem key={attachment} attachment={attachment} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
