'use client';

import React, { Key, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import {
  AssetStatus,
  AssetType,
  ChecklistUse,
  Maintenance,
  User,
} from '@prisma/client';

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

// import Loading from '@/components/Loading';
import AssetDetails from '@/components/asset/AssetDetails';
import AssetMaintenance from '@/components/asset/AssetMaintenance';
import AssetAttachment from '@/components/asset/AssetAttachment';
import { fetchMutatedAssetItem } from '@/lib/actions/asset';
import { useMediaQuery } from '@/hooks/use-media-query';

interface AssetItemComponentProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
  statusList: AssetStatus[];
  typeList: AssetType[];
  maintenanceList: Maintenance[];
  checklistUse: ChecklistUse[];
  userList: User[];
}

export default function AssetItemComponent({
  mutatedAsset,
  statusList,
  typeList,
  maintenanceList,
  checklistUse,
  userList,
}: AssetItemComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [mounted, setMounted] = useState(false);

  const tab = searchParams.get('tab');

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleTabChange(key: Key) {
    router.push(`${pathname}?tab=${key}`);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-col flex-1 p-0">
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
                  <span>{mutatedAsset.name}</span>
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
                <DropdownItem key="details">{mutatedAsset.name}</DropdownItem>
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
      <div className="flex overflow-hidden flex-1">
        {tab === 'details' && (
          <AssetDetails
            mutatedAsset={mutatedAsset}
            statusList={statusList}
            typeList={typeList}
            checklistUse={checklistUse}
            userList={userList}
          />
        )}
        {tab === 'maintenance' && (
          <AssetMaintenance maintenanceList={maintenanceList} />
        )}
        {tab === 'attachment' && <AssetAttachment />}
      </div>
    </div>
  );
}
