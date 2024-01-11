'use client';

import React, { Key, useEffect, useState } from 'react';
import Loading from '@/components/client/Loading';
import { Asset, ChecklistUse, Maintenance } from '@prisma/client';
import AssetDetails from '@/components/client/asset/AssetDetails';
import AssetMaintenance from '@/components/client/asset/AssetMaintenance';
import AssetAttachment from '@/components/client/asset/AssetAttachment';
import {
  Button,
  Card,
  Chip,
  Divider,
  Link,
  Tab,
  Tabs,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <div>
      <div className="flex flex-row items-center">
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
              </div>
            }
          />
        </Tabs>
      </div>
      <div className="flex flex-row justify-between items-center my-4">
        <h2 className="text-xl font-semibold">{asset.name}</h2>
        <div className="flex flex-row">
          <div className="flex flex-row">
            <Button isIconOnly className="ml-1" variant="faded">
              <PencilLine size={18} />
            </Button>
            <Button isIconOnly className="ml-1" variant="faded">
              <PackagePlus size={18} />
            </Button>
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
