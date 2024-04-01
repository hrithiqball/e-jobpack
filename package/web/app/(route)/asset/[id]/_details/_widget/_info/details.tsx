import { Fragment, useState, useTransition } from 'react';
import dayjs from 'dayjs';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  BookImage,
  ChevronLeft,
  Edit,
  MoreHorizontal,
  Printer,
  QrCode,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAssetStatusStore } from '@/hooks/use-asset-status.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { useAssetStore } from '@/hooks/use-asset.store';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';

import { updateAsset } from '@/data/asset.action';
import { isNullOrEmpty } from '@/lib/function/string';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { baseServerUrl } from '@/public/constant/url';
import QrCodeGenerator from './qr-code-download';

type AssetDetailsStaticProps = {
  startEditing: () => void;
};

export default function AssetDetailsStatic({
  startEditing,
}: AssetDetailsStaticProps) {
  const [transitioning, startTransition] = useTransition();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const { assetStatusList } = useAssetStatusStore();
  const { assetTypeList } = useAssetTypeStore();
  const { asset, assetImageSidebar, setAssetImageSidebar } = useAssetStore();

  const [openQrCodeDownload, setOpenQrCodeDownload] = useState(false);

  function handleStatusUpdate(statusId: string) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (!asset) {
        toast.error('Asset not found');
        return;
      }

      toast.promise(updateAsset(user.id, asset.id, { statusId }), {
        loading: 'Updating asset status...',
        success: 'Status updated',
        error: 'Failed to update asset status',
      });
    });
  }

  function handleTypeUpdate(type: string) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (asset === null) {
        toast.error('Asset not found');
        return;
      }

      toast.promise(updateAsset(user.id, asset.id, { type }), {
        loading: 'Updating asset type...',
        success: 'Type updated',
        error: 'Failed to update asset type',
      });
    });
  }

  function handleOpenQrCodeDownload() {
    setOpenQrCodeDownload(true);
  }

  function handleCloseQrCodeDownload() {
    setOpenQrCodeDownload(false);
  }

  return asset ? (
    <Fragment>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {assetImageSidebar ? (
            <BookImage
              onClick={setAssetImageSidebar}
              className="cursor-pointer hover:text-primary-500"
            />
          ) : (
            <ChevronLeft
              onClick={setAssetImageSidebar}
              className="cursor-pointer hover:text-primary-500"
            />
          )}
          <span className="text-3xl font-bold">{asset.name}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" disabled={transitioning}>
              <MoreHorizontal size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-40 rounded-lg p-2">
            {role !== 'TECHNICIAN' && (
              <PopoverItem
                onClick={startEditing}
                startContent={<Edit size={18} />}
              >
                Edit
              </PopoverItem>
            )}
            <PopoverItem startContent={<Printer size={18} />}>
              Print Details
            </PopoverItem>
            <PopoverItem
              onClick={handleOpenQrCodeDownload}
              startContent={<QrCode size={18} />}
            >
              Download QR
            </PopoverItem>
          </PopoverContent>
        </Popover>
      </div>
      <hr />
      <Table aria-label="Asset details">
        <TableBody>
          <TableRow>
            <TableCell className=" font-semibold">Description</TableCell>
            <TableCell>
              {isNullOrEmpty(asset.description) || 'No description'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className=" font-semibold">Tag</TableCell>
            <TableCell>
              {isNullOrEmpty(asset.tag) || 'No tag provided'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Location</TableCell>
            <TableCell>
              {isNullOrEmpty(asset.location) || 'Not Specified'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-1 rounded-lg bg-gray-200 px-2 py-1 dark:bg-gray-800">
                      <div
                        style={{
                          backgroundColor: asset.assetStatus?.color ?? 'grey',
                        }}
                        className="mx-1 w-1 rounded-full p-1"
                      ></div>
                      <p className="pr-1 text-xs">
                        {isNullOrEmpty(asset.assetStatus?.title) ||
                          'Not specified'}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full rounded-lg p-2">
                  {assetStatusList.map(status => (
                    <PopoverItem
                      key={status.id}
                      onClick={() => handleStatusUpdate(status.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          style={{
                            backgroundColor: status.color ?? 'grey',
                          }}
                          className="mx-1 size-1 rounded-full p-1"
                        ></div>
                        <p>{status.title}</p>
                      </div>
                    </PopoverItem>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Type</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-1 rounded-lg bg-gray-200 px-2 py-1 dark:bg-gray-800">
                      <p className="px-2 text-xs">
                        {isNullOrEmpty(asset.assetType?.title) ||
                          'Not specified'}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full rounded-lg p-2">
                  {assetTypeList.map(type => (
                    <PopoverItem
                      key={type.id}
                      onClick={() => handleTypeUpdate(type.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <p>{type.title}</p>
                      </div>
                    </PopoverItem>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Updated By</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                {asset.updatedBy.image ? (
                  <Image
                    src={`${baseServerUrl}/user/${asset.updatedBy.image}`}
                    alt={asset.updatedBy.name}
                    width={20}
                    height={20}
                    className="size-5 rounded-full bg-teal-800 object-contain"
                  />
                ) : (
                  <div className="flex size-5 flex-col items-center justify-center rounded-full bg-teal-800">
                    <p className="text-xs text-white">
                      {asset.updatedBy.name.substring(0, 1).toUpperCase()}
                    </p>
                  </div>
                )}
                <span>on</span>
                <span>
                  {dayjs(asset.updatedOn).format('DD/MM/YYYY hh:mmA')}
                </span>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Created By</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                {asset.createdBy.image ? (
                  <Image
                    src={`${baseServerUrl}/user/${asset.createdBy.image}`}
                    alt={asset.createdBy.name}
                    width={20}
                    height={20}
                    className="size-5 rounded-full bg-teal-800 object-contain"
                  />
                ) : (
                  <div className="flex size-5 flex-col items-center justify-center rounded-full bg-teal-800">
                    <p className="text-xs text-white">
                      {asset.createdBy.name.substring(0, 1).toUpperCase()}
                    </p>
                  </div>
                )}
                <span>on</span>
                <span>
                  {dayjs(asset.createdOn).format('DD/MM/YYYY hh:mmA')}
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <QrCodeGenerator
        assetId={asset.id}
        open={openQrCodeDownload}
        onClose={handleCloseQrCodeDownload}
      />
    </Fragment>
  ) : null;
}
