import { Fragment, useState } from 'react';
import Image from 'next/image';

import { Button, Card } from '@nextui-org/react';
import { BookImage, ChevronLeft, ImageIcon, ImagePlus } from 'lucide-react';

import AssetDetailsInfo from './_asset-details-info';
import AddImage from './AddImage';
import { useAssetStore } from '@/hooks/use-asset.store';
import AssetImageCarousel from './AssetImageCarousel';
import AssetCover from './AssetCover';

export default function DetailsWidget() {
  const asset = useAssetStore.getState().asset;

  const [hoverCoverImage, setHoverCoverImage] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);
  const [openChangeCover, setOpenChangeCover] = useState(false);
  const [isCollapse, setIsCollapse] = useState(false);

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

  function handleOpenChangeCover() {
    setOpenChangeCover(true);
  }

  function handleCloseChangeCover() {
    setOpenChangeCover(false);
  }

  return (
    asset && (
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
                          onClick={handleOpenChangeCover}
                          startContent={<ImageIcon size={18} />}
                          className="absolute left-0 z-50 mx-8 my-4 px-4"
                        >
                          Change Cover
                        </Button>
                      )}
                      {asset.assetCover ? (
                        <Image
                          alt={asset.name}
                          src={asset.assetCover}
                          width={400}
                          height={800}
                          className="flex w-full flex-1 cursor-pointer rounded-md object-cover filter hover:brightness-75"
                        />
                      ) : (
                        <div className="flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400">
                          <ImagePlus size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap space-x-4">
                      {asset.attachmentPath.length > 0 && (
                        <AssetImageCarousel
                          handleOpenUploadImage={handleOpenUploadImage}
                          attachmentPath={asset.attachmentPath}
                        />
                      )}
                    </div>
                  </Fragment>
                )}
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="faded"
                    color="primary"
                    isIconOnly={isCollapse}
                    startContent={
                      !isCollapse ? <ChevronLeft size={18} /> : null
                    }
                    onClick={handleCollapse}
                  >
                    {isCollapse ? <BookImage size={18} /> : 'Collapse'}
                  </Button>
                </div>
              </div>
              <AssetDetailsInfo />
            </div>
          </div>
        </Card>
        <AddImage open={openUploadImage} onClose={handleCloseUploadImage} />
        <AssetCover open={openChangeCover} onClose={handleCloseChangeCover} />
      </div>
    )
  );
}
