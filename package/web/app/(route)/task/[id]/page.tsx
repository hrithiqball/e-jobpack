import { fetchAssetList } from '@/data/asset.action';
import { fetchChecklistLibraryList } from '@/data/checklist-library.action';
import { fetchMaintenanceItem } from '@/data/maintenance.action';

import MaintenanceComponent from './_maintenance-component';

type TaskItemPageProps = {
  params: { id: string };
};

export default async function TaskItemPage({ params }: TaskItemPageProps) {
  const maintenance = await fetchMaintenanceItem(params.id);
  const checklistLibrary = await fetchChecklistLibraryList();
  const assetList = await fetchAssetList();

  return (
    <div className="flex h-full flex-col">
      <MaintenanceComponent
        maintenance={maintenance}
        checklistLibraryList={checklistLibrary}
        assetList={assetList}
      />
    </div>
  );
}
