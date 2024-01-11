'use client';

import React, { Key, useEffect, useState } from 'react';
import Loading from '@/components/client/Loading';
import { Asset, ChecklistUse, Maintenance } from '@prisma/client';
import AssetDetails from '@/components/client/asset/AssetDetails';
import AssetMaintenance from '@/components/client/asset/AssetMaintenance';
import AssetAttachment from '@/components/client/asset/AssetAttachment';
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Tab,
  Tabs,
  Tooltip,
} from '@nextui-org/react';
import { ChevronLeft, PackagePlus, PencilLine } from 'lucide-react';

export default function AssetComponent({
  asset,
  maintenanceList,
  checklistUse,
}: {
  asset: Asset;
  maintenanceList: Maintenance[];
  checklistUse: ChecklistUse[];
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  function updateMedia() {
    setDesktop(window.innerWidth > 650);
  }

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <div>
      <div className="flex flex-row items-center justify-between sm:justify-normal">
        <Button
          className="max-w-min"
          as={Link}
          href="/asset"
          startContent={<ChevronLeft size={18} />}
          variant="faded"
          size="sm"
        >
          Back
        </Button>
        {isDesktop ? (
          <Tabs
            aria-label="Asset Attribute"
            size="sm"
            className="ml-4"
            selectedKey={selectedTab}
            onSelectionChange={(key: Key) => setSelectedTab(key as string)}
          >
            <Tab
              key="details"
              title={
                <div className="flex items-center space-x-2">
                  <span>Details</span>
                </div>
              }
            />
            <Tab
              key="maintenance"
              title={
                <div className="flex items-center space-x-2">
                  <span>Maintenance</span>
                  <Chip size="sm" variant="faded">
                    {maintenanceList.length}
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
                    3
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
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectedKeys={selectedTab}
                onAction={key => setSelectedTab(key as string)}
              >
                <DropdownItem key="details">Details</DropdownItem>
                <DropdownItem key="maintenance">Maintenance</DropdownItem>
                <DropdownItem key="attachment">Attachment</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-center my-4">
        <h2 className="text-xl font-semibold">{asset.name}</h2>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Tooltip content="Edit Asset">
              <Button size="sm" isIconOnly className="ml-1" variant="faded">
                <PencilLine size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Add sub asset to this asset">
              <Button size="sm" isIconOnly className="ml-1" variant="faded">
                <PackagePlus size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <Divider />
      <div className="overflow-hidden">
        {selectedTab === 'details' && (
          <AssetDetails asset={asset} checklistUse={checklistUse} />
        )}
        {selectedTab === 'maintenance' && (
          <AssetMaintenance maintenanceList={maintenanceList} />
        )}
        {selectedTab === 'attachment' && <AssetAttachment />}
      </div>
    </div>
  );
}
