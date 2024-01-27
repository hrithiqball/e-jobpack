import React from 'react';

import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import {
  fetchMaintenanceItem,
  fetchMutatedMaintenanceItem,
} from '@/lib/actions/maintenance';
import MaintenanceChecklistList from '@/components/checklist/ChecklistComponent';
import MaintenanceComponent from '@/components/maintenance/MaintenanceComponent';

interface TaskItemPageProps {
  params: { id: string };
}

export default async function TaskItemPage({ params }: TaskItemPageProps) {
  const mutatedMaintenance = await fetchMutatedMaintenanceItem(params.id);
  const assetList = await fetchAssetList();
  const checklistList = await fetchChecklistList(params.id);
  const maintenance = await fetchMaintenanceItem(params.id);
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex flex-col h-full">
      <MaintenanceComponent
        mutatedMaintenance={mutatedMaintenance}
        maintenance={maintenance}
        checklistLibraryList={checklistLibrary}
        assetList={assetList}
        checklistList={checklistList}
      >
        <MaintenanceChecklistList checklistList={checklistList} />
      </MaintenanceComponent>
    </div>
  );
}
