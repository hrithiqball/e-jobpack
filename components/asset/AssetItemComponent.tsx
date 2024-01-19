'use client';

import React, { Key, useEffect, useState } from 'react';
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

import Loading from '@/components/Loading';
import AssetDetails from '@/components/asset/AssetDetails';
import AssetMaintenance from '@/components/asset/AssetMaintenance';
import AssetAttachment from '@/components/asset/AssetAttachment';
import { fetchMutatedAssetItem } from '@/lib/actions/asset';

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
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMedia() {
    setDesktop(window.innerWidth > 650);
  }

  if (!mounted) return <Loading label="Hang on tight" />;

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
            selectedKey={selectedTab}
            onSelectionChange={(key: Key) => setSelectedTab(key as string)}
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
                    <span>{maintenanceList.length}</span>
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
                  {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
                  {selectedTab === 'maintenance' && (
                    <Chip size="sm" variant="faded">
                      <span>{maintenanceList.length}</span>
                    </Chip>
                  )}
                  {selectedTab === 'attachment' && (
                    <Chip size="sm" variant="faded">
                      1
                    </Chip>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={selectedTab}
                onAction={key => setSelectedTab(key as string)}
              >
                <DropdownItem key="details">{mutatedAsset.name}</DropdownItem>
                <DropdownItem key="maintenance">
                  Maintenance
                  <Chip className="ml-1" size="sm" variant="faded">
                    <span>{maintenanceList.length}</span>
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
        {selectedTab === 'details' && (
          <AssetDetails
            mutatedAsset={mutatedAsset}
            statusList={statusList}
            typeList={typeList}
            checklistUse={checklistUse}
            userList={userList}
          />
        )}
        {selectedTab === 'maintenance' && (
          <AssetMaintenance maintenanceList={maintenanceList} />
        )}
        {selectedTab === 'attachment' && <AssetAttachment />}
      </div>
    </div>
  );
}
