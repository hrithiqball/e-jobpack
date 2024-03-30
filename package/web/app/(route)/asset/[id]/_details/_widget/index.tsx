import { Fragment, useState } from 'react';

import { Card } from '@nextui-org/react';
import { ImageIcon, ImagePlus } from 'lucide-react';

import { useAssetStore } from '@/hooks/use-asset.store';

import AssetDetailsInfo from './_info';
import AssetImageCarousel from './_image-carousel';
import AssetAddImage from './add-image';
import AssetCover from './_cover';
import { baseServerUrl } from '@/public/constant/url';
import { isNullOrEmpty } from '@/lib/function/string';
import { Button } from '@/components/ui/button';

export default function DetailsWidget() {
  const { asset, assetImageSidebar } = useAssetStore();

  const [hoverCoverImage, setHoverCoverImage] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);
  const [openChangeCover, setOpenChangeCover] = useState(false);

  function handleCoverHoverEnter() {
    setHoverCoverImage(true);
  }

  function handleCoverHoverLeave() {
    setHoverCoverImage(false);
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
              <div className="flex w-1/3 flex-col space-y-4">
                {!assetImageSidebar && (
                  <Fragment>
                    <div
                      className="flex w-full flex-1"
                      onMouseEnter={handleCoverHoverEnter}
                      onMouseLeave={handleCoverHoverLeave}
                    >
                      {hoverCoverImage && (
                        <Button
                          variant="outline"
                          size="withIcon"
                          onClick={handleOpenChangeCover}
                          className="absolute left-0 z-50 mx-8 my-4 px-4"
                        >
                          <ImageIcon size={18} />
                          <p>Change Cover</p>
                        </Button>
                      )}
                      {isNullOrEmpty(asset.assetCover) ? (
                        <img
                          src={`${baseServerUrl}/asset/${asset.assetCover}`}
                          alt={asset.name}
                          className="flex w-full flex-1 cursor-pointer rounded-md bg-gray-600 object-contain filter hover:brightness-75"
                        />
                      ) : (
                        <div className="flex w-full flex-1 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 px-36">
                          <ImagePlus size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap space-x-4">
                      <AssetImageCarousel
                        handleOpenUploadImage={handleOpenUploadImage}
                        attachmentPath={asset.attachmentPath}
                      />
                    </div>
                  </Fragment>
                )}
              </div>
              <div className="w-2/3">
                <AssetDetailsInfo />
              </div>
            </div>
          </div>
        </Card>
        <AssetAddImage
          open={openUploadImage}
          onClose={handleCloseUploadImage}
        />
        <AssetCover open={openChangeCover} onClose={handleCloseChangeCover} />
      </div>
    )
  );
}
