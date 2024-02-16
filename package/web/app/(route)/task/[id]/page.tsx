import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { fetchMaintenanceItemAndAssetOption } from '@/lib/actions/maintenance';

import ChecklistComponent from './_checklist-component';
import MaintenanceComponent from './_maintenance-component';

interface TaskItemPageProps {
  params: { id: string };
}

export default async function TaskItemPage({ params }: TaskItemPageProps) {
  const mutatedMaintenance = await fetchMaintenanceItemAndAssetOption(
    params.id,
  );
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
