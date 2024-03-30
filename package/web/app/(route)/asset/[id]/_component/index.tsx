'use client';

import { Key, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { AssetStatus, Maintenance } from '@prisma/client';

import { Tab, Tabs } from '@nextui-org/react';

import { AssetItem, AssetType } from '@/types/asset';
import { ChecklistLibraryList } from '@/types/checklist';

import { useAssetStatusStore } from '@/hooks/use-asset-status.store';
import { useAssetTypeStore } from '@/hooks/use-asset-type.store';
import { useAssetStore } from '@/hooks/use-asset.store';
import { useChecklistLibStore } from '@/hooks/use-checklist-lib.store';

import AssetDetails from '../_details';
import AssetMaintenance from '../_maintenance';
import AssetChecklist from '../_checklist';
import { Users } from '@/types/user';

type AssetItemComponentProps = {
  asset: AssetItem;
  assetStatusList: AssetStatus[];
  assetTypeList: AssetType[];
  maintenanceList: Maintenance[];
  userList: Users;
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
    <div className="flex flex-1 flex-col">
      <Tabs
        aria-label="asset-navigation"
        variant="underlined"
        color="primary"
        selectedKey={tab}
        onSelectionChange={handleTabChange}
      >
        <Tab key="details" title="Details" className="col flex flex-1">
          <AssetDetails userList={userList} />
        </Tab>
        <Tab key="maintenance" title="Maintenance" className="col flex flex-1">
          <AssetMaintenance maintenanceList={maintenanceList} />
        </Tab>
        <Tab key="checklist" title="Checklist" className="col flex flex-1">
          <AssetChecklist />
        </Tab>
      </Tabs>
    </div>
  );
}
