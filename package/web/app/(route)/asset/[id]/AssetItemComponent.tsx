'use client';

import { Key, useEffect } from 'react';
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

import { AssetItem } from '@/types/asset';
import { ChecklistLibraryList } from '@/types/checklist';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useAssetStatusStore } from '@/hooks/use-asset-status.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { useAssetStore } from '@/hooks/use-asset.store';
import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

import AssetDetails from './_asset-details';
import AssetMaintenance from './_asset-maintenance';
import AssetChecklist from './_asset-checklist';

type AssetItemComponentProps = {
  asset: AssetItem;
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
  maintenanceList: Maintenance[];
  userList: User[];
  checklistLibraryList: ChecklistLibraryList;
};

export default function AssetItemComponent({
  asset,
  assetStatusList,
  assetTypeList,
  maintenanceList,
  userList,
  checklistLibraryList,
}: AssetItemComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { setAsset } = useAssetStore();
  const { setChecklistLibraryList } = useChecklistLibStore();
  const { setAssetStatusList } = useAssetStatusStore();
  const { setAssetTypeList } = useAssetTypeStore();

  useEffect(() => {
    setAsset(asset);
    setChecklistLibraryList(checklistLibraryList);
    setAssetStatusList(assetStatusList);
    setAssetTypeList(assetTypeList);
  }, [
    setAsset,
    setChecklistLibraryList,
    setAssetStatusList,
    setAssetTypeList,
    asset,
    assetStatusList,
    assetTypeList,
    checklistLibraryList,
  ]);

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
              key="checklist"
              title={
                <div className="flex items-center space-x-2">
                  <span>Checklist</span>
                  <Chip size="sm" variant="faded">
                    <span>{checklistLibraryList.length}</span>
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
                  Checklist
                  <Chip className="ml-1" size="sm" variant="faded">
                    <span>{checklistLibraryList.length}</span>
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
        {tab === 'checklist' && <AssetChecklist />}
      </div>
    </div>
  );
}
