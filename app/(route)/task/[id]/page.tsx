import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { fetchMutatedMaintenanceItem } from '@/lib/actions/maintenance';

import ChecklistComponent from '@/app/(route)/task/[id]/_maintenance-component/_checklist-component';
import MaintenanceComponent from '@/app/(route)/task/[id]/_maintenance-component';

interface TaskItemPageProps {
  params: { id: string };
}

export default async function TaskItemPage({ params }: TaskItemPageProps) {
  const mutatedMaintenance = await fetchMutatedMaintenanceItem(params.id);
  const assetList = await fetchAssetList();
  const checklistList = await fetchChecklistList(params.id);
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex h-full flex-col">
      <MaintenanceComponent
        mutatedMaintenance={mutatedMaintenance}
        checklistLibraryList={checklistLibrary}
        assetList={assetList}
        checklistList={checklistList}
      >
        <ChecklistComponent checklistList={mutatedMaintenance.checklist} />
      </MaintenanceComponent>
    </div>
  );
}
