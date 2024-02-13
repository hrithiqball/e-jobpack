'use client';

import { Key } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AssetStatus, AssetType, Maintenance, User } from '@prisma/client';

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { ChevronLeft } from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { AssetItem } from '@/types/asset';

import AssetDetails from './_asset-details';
import AssetMaintenance from './_asset-maintenance';
import AssetAttachment from './_asset-attachment';
import { useAssetStatusStore } from '@/hooks/use-asset-status.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { useAssetStore } from '@/hooks/use-asset.store';

type AssetItemComponentProps = {
  asset: AssetItem;
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
  maintenanceList: Maintenance[];
  userList: User[];
};

export default function AssetItemComponent({
  asset,
  assetStatusList,
  assetTypeList,
  maintenanceList,
  userList,
}: AssetItemComponentProps) {
  useAssetStatusStore.setState({ assetStatusList });
  useAssetTypeStore.setState({ assetTypeList });
  useAssetStore.setState({ asset });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const tab = searchParams.get('tab') ?? 'details';

  function handleTabChange(key: Key) {
    router.push(`${pathname}?tab=${key}`);
  }

  return (
    <div className="flex flex-1 flex-col p-0">
      <div className="flex flex-row items-center justify-between px-2">
        <Button
          size="sm"
          variant="faded"
          href="/asset"
          as={Link}
          startContent={<ChevronLeft size={18} />}
          className="max-w-min"
        >
          Back
        </Button>
        {isDesktop ? (
          <Tabs
            aria-label="Asset Attribute"
            size="sm"
            color="primary"
            selectedKey={tab}
            onSelectionChange={handleTabChange}
            className="ml-4"
          >
            <Tab
              key="details"
              title={
                <div className="flex items-center space-x-2">
                  <span>{asset.name}</span>
                </div>
              }
            />
            <Tab
              key="maintenance"
              title={
                <div className="flex items-center space-x-2">
                  <span>Maintenance</span>
                  <Chip size="sm" variant="faded">
                    <span>
                      {
                        maintenanceList.filter(
                          maintenance => !maintenance.isRejected,
                        ).length
                      }
                    </span>
                  </Chip>
                </div>
              }
            />
            <Tab
              key="attachment"
              title={
                <div className="flex items-center space-x-2">
                  <span>Attachment</span>
                  <Chip size="sm" variant="faded">
                    <span>1</span>
                  </Chip>
                </div>
              }
            />
          </Tabs>
        ) : (
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="faded">
                  {tab!.charAt(0).toUpperCase() + tab!.slice(1)}
                  {tab === 'maintenance' && (
                    <Chip size="sm" variant="faded">
                      <span>
                        {
                          maintenanceList.filter(
                            maintenance => !maintenance.isRejected,
                          ).length
                        }
                      </span>
                    </Chip>
                  )}
                  {tab === 'attachment' && (
                    <Chip size="sm" variant="faded">
                      1
                    </Chip>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={tab ?? 'details'}
                onAction={handleTabChange}
              >
                <DropdownItem key="details">{asset.name}</DropdownItem>
                <DropdownItem key="maintenance">
                  Maintenance
                  <Chip className="ml-1" size="sm" variant="faded">
                    <span>
                      {
                        maintenanceList.filter(
                          maintenance => !maintenance.isRejected,
                        ).length
                      }
                    </span>
                  </Chip>
                </DropdownItem>
                <DropdownItem key="attachment">
                  Attachment
                  <Chip className="ml-1" size="sm" variant="faded">
                    <span>1</span>
                  </Chip>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
        <div></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {tab === 'details' && <AssetDetails userList={userList} />}
        {tab === 'maintenance' && (
          <AssetMaintenance maintenanceList={maintenanceList} />
        )}
        {tab === 'attachment' && <AssetAttachment />}
      </div>
    </div>
  );
}
