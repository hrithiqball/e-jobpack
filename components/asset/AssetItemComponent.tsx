'use client';

import React, { Key, useEffect, useState } from 'react';
import { Asset, ChecklistUse, Maintenance, User } from '@prisma/client';

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
import {
  ChevronLeft,
  MoreHorizontal,
  PencilLine,
  Printer,
  Save,
} from 'lucide-react';

import Loading from '@/components/Loading';
import AssetDetails from '@/components/asset/AssetDetails';
import AssetMaintenance from '@/components/asset/AssetMaintenance';
import AssetAttachment from '@/components/asset/AssetAttachment';
import { useCurrentRole } from '@/hooks/use-current-role';
import { fetchMutatedAssetItem } from '@/lib/actions/asset';

interface AssetItemComponentProps {
  mutatedAsset: Awaited<ReturnType<typeof fetchMutatedAssetItem>>;
  asset: Asset;
  maintenanceList: Maintenance[];
  checklistUse: ChecklistUse[];
  userList: User[];
}

export default function AssetItemComponent({
  mutatedAsset,
  asset,
  maintenanceList,
  checklistUse,
  userList,
}: AssetItemComponentProps) {
  const role = useCurrentRole();

  const [mounted, setMounted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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

  function handleAssetAction(key: Key) {
    switch (key) {
      case 'edit-asset':
        setIsEdit(true);
        break;
      case 'print-asset':
        // TODO: print asset
        break;
    }
  }

  function handleSave() {
    setIsEdit(false);
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
                <DropdownItem key="details">{asset.name}</DropdownItem>
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
        <div className="flex items-center space-x-1">
          {isEdit && (
            <Button
              size="sm"
              variant="faded"
              color="success"
              onClick={handleSave}
              startContent={<Save size={18} />}
            >
              Save
            </Button>
          )}
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="faded">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={handleAssetAction}
              disabledKeys={role === 'TECHNICIAN' ? ['edit-asset'] : []}
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
                Print to PDF
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {/* <div className="flex flex-row justify-between items-center my-4">
        <h2 className="text-xl font-semibold">{asset.name}</h2>
        {role === 'ADMIN' ||
          (role === 'SUPERVISOR' && (
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
          ))}
      </div> */}
      <div className="flex overflow-hidden flex-1">
        {selectedTab === 'details' && (
          <AssetDetails
            mutatedAsset={mutatedAsset}
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
