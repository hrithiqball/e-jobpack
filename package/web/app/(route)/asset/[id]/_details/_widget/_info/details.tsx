import { Fragment, Key, useTransition } from 'react';
import dayjs from 'dayjs';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import {
  BookImage,
  ChevronLeft,
  MoreHorizontal,
  PencilLine,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAssetStatusStore } from '@/hooks/use-asset-status.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { useAssetStore } from '@/hooks/use-asset.store';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';

import { updateAsset } from '@/data/asset.action';
import { isNullOrEmpty } from '@/lib/function/string';

type AssetDetailsStaticProps = {
  handleAssetDetailsAction: (key: Key) => void;
};

export default function AssetDetailsStatic({
  handleAssetDetailsAction,
}: AssetDetailsStaticProps) {
  const [transitioning, startTransition] = useTransition();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const { assetStatusList } = useAssetStatusStore();
  const { assetTypeList } = useAssetTypeStore();
  const { asset, assetImageSidebar, setAssetImageSidebar } = useAssetStore();

  function handleStatusUpdate(key: Key) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      if (asset === null) {
        toast.error('Asset not found');
        return;
      }

      toast.promise(
        updateAsset(user.id, asset.id, { statusId: key as string }),
        {
          loading: 'Updating asset status...',
          success: 'Status updated',
          error: 'Failed to update asset status',
        },
      );
    });
  }

  function handleTypeUpdate(key: Key) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      if (asset === null) {
        toast.error('Asset not found');
        return;
      }

      toast.promise(updateAsset(user.id, asset.id, { type: key as string }), {
        loading: 'Updating asset type...',
        success: 'Type updated',
        error: 'Failed to update asset type',
      });
    });
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
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              isDisabled={transitioning}
            >
              <MoreHorizontal size={18} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disabledKeys={role === 'TECHNICIAN' ? ['edit-asset'] : []}
            onAction={handleAssetDetailsAction}
          >
            <DropdownItem
              key="edit-asset"
              startContent={<PencilLine size={18} />}
            >
              Edit Asset
            </DropdownItem>
            <DropdownItem
              key="print-asset"
              startContent={<Printer size={18} />}
            >
              Print Details
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Divider />
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
              <Dropdown>
                <DropdownTrigger>
                  <Chip
                    size="sm"
                    variant="faded"
                    startContent={
                      <div
                        style={{
                          backgroundColor: asset.assetStatus?.color ?? 'grey',
                        }}
                        className="mx-1 w-1 rounded-full p-1"
                      ></div>
                    }
                    className="hover:cursor-pointer"
                  >
                    {isNullOrEmpty(asset.assetStatus?.title) || 'Not Specified'}
                  </Chip>
                </DropdownTrigger>
                <DropdownMenu onAction={handleStatusUpdate}>
                  {assetStatusList.map(status => (
                    <DropdownItem key={status.id}>
                      <Chip
                        size="sm"
                        variant="faded"
                        startContent={
                          <div
                            style={{
                              backgroundColor: status.color ?? 'grey',
                            }}
                            className="mx-1 w-1 rounded-full p-1"
                          ></div>
                        }
                        className="hover:cursor-pointer"
                      >
                        {isNullOrEmpty(status.title) || 'Not Specified'}
                      </Chip>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Type</TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Chip
                    size="sm"
                    variant="faded"
                    className="hover:cursor-pointer"
                  >
                    {asset.assetType?.title}
                  </Chip>
                </DropdownTrigger>
                <DropdownMenu onAction={handleTypeUpdate}>
                  {assetTypeList.map(type => (
                    <DropdownItem key={type.id}>
                      <Chip size="sm" variant="faded">
                        {type.title}
                      </Chip>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">Updated By</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Avatar
                  size="sm"
                  showFallback
                  src={asset.updatedBy.image ?? ''}
                  name={asset.updatedBy.name}
                  className="mr-1"
                />
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
                <Avatar
                  size="sm"
                  showFallback
                  src={asset.createdBy.image ?? ''}
                  name={asset.createdBy.name}
                  className="mr-1"
                />
                <span>on</span>
                <span>
                  {dayjs(asset.createdOn).format('DD/MM/YYYY hh:mmA')}
                </span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Fragment>
  ) : null;
}
