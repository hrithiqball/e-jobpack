import { Fragment, useState } from 'react';
import Image from 'next/image';

import { Button, Card } from '@nextui-org/react';
import { BookImage, ChevronLeft, ImageIcon, ImagePlus } from 'lucide-react';

import { MutatedAsset } from '@/types/asset';

import AssetDetailsInfo from './_asset-details-info';
import AddImage from './AddImage';

type DetailsWidgetProps = {
  mutatedAsset: MutatedAsset;
};

export default function DetailsWidget({ mutatedAsset }: DetailsWidgetProps) {
  const [hoverCoverImage, setHoverCoverImage] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);

  function handleCoverHoverEnter() {
    setHoverCoverImage(true);
  }

  function handleCoverHoverLeave() {
    setHoverCoverImage(false);
  }

  function handleCollapse() {
    setIsCollapse(!isCollapse);
  }

  function handleOpenUploadImage() {
    setOpenUploadImage(true);
  }

  function handleCloseUploadImage() {
    setOpenUploadImage(false);
  }

  return (
    <div className="flex w-3/4 p-2">
      <Card shadow="none" className="flex flex-1 p-4 dark:bg-card">
        <div className="flex min-w-min flex-1">
          <div className="flex flex-1 space-x-4">
            <div className="flex flex-col space-y-4">
              {!isCollapse && (
                <Fragment>
                  <div
                    className="flex w-full flex-1"
                    onMouseEnter={handleCoverHoverEnter}
                    onMouseLeave={handleCoverHoverLeave}
                  >
                    {hoverCoverImage && (
                      <Button
                        size="sm"
                        variant="faded"
                        color="primary"
                        className="absolute left-0 z-50 mx-8 my-4 px-4"
                        startContent={<ImageIcon size={18} />}
                      >
                        Change Cover
                      </Button>
                    )}
                    <Image
                      alt={mutatedAsset.name}
                      src={
                        'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                      }
                      width={400}
                      height={800}
                      className="flex w-full flex-1 cursor-pointer rounded-md object-cover filter hover:brightness-75"
                    />
                  </div>
                  <div className="flex flex-wrap space-x-4">
                    <Image
                      alt={mutatedAsset.name}
                      src={
                        'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                      }
                      width={200}
                      height={800}
                      className="flex flex-1 rounded-md object-cover"
                    />
                    <Image
                      alt={mutatedAsset.name}
                      src={
                        'https://www.nu-heat.co.uk/wp-content/uploads/2020/10/Underfloor-heating-manifold.jpg'
                      }
                      width={200}
                      height={800}
                      className="flex flex-1 rounded-md object-cover"
                    />
                  </div>
                </Fragment>
              )}
              <div className="flex justify-between">
                {!isCollapse && (
                  <Button
                    size="sm"
                    variant="faded"
                    color="primary"
                    startContent={<ImagePlus size={18} />}
                    onClick={handleOpenUploadImage}
                  >
                    Add Image
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="faded"
                  color="primary"
                  isIconOnly={isCollapse}
                  startContent={!isCollapse ? <ChevronLeft size={18} /> : null}
                  onClick={handleCollapse}
                >
                  {isCollapse ? <BookImage size={18} /> : 'Collapse'}
                </Button>
              </div>
            </div>
            <AssetDetailsInfo asset={mutatedAsset} />
          </div>
        </div>
      </Card>
      <AddImage open={openUploadImage} onClose={handleCloseUploadImage} />
    </div>
  );
}
