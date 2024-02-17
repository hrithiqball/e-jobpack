import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { fetchMaintenanceItem } from '@/lib/actions/maintenance';

import ChecklistComponent from './_checklist-component';
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
      >
        <ChecklistComponent checklistList={maintenance.checklist} />
      </MaintenanceComponent>
    </div>
  );
}
