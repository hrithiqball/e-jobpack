'use client';

import React, { Key, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Loading from '@/components/client/Loading';
import { asset, checklist_use, maintenance } from '@prisma/client';
import { LuChevronLeft, LuPencilLine, LuPackagePlus } from 'react-icons/lu';
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

export default function Asset({
  asset,
  maintenanceList,
  checklistUse,
}: {
  asset: asset;
  maintenanceList: maintenance[];
  checklistUse: checklist_use[];
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading label="Hang on tight" />;

  return (
    <Card
      className={`rounded-md p-4 m-4 flex-grow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
    >
      <div className="flex flex-row">
        <Button
          className="max-w-min"
          as={Link}
          href="/asset"
          startContent={<LuChevronLeft />}
          variant="faded"
          size="md"
        >
          Back
        </Button>
        <Tabs
          aria-label="Asset Attribute"
          size="md"
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
              <LuPencilLine />
            </Button>
            <Button isIconOnly className="ml-1" variant="faded">
              <LuPackagePlus />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <Card className="rounded-md overflow-hidden mt-4">
        {selectedTab === 'details' && (
          <AssetDetails asset={asset} checklistUse={checklistUse} />
        )}
        {selectedTab === 'maintenance' && (
          <AssetMaintenance maintenanceList={maintenanceList} />
        )}
        {selectedTab === 'attachment' && <AssetAttachment />}
      </Card>
    </Card>
  );
}
