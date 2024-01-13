import React from 'react';

import MaintenanceChecklistList from '@/components/client/checklist/ChecklistComponent';
import MaintenanceComponent from '@/components/client/maintenance/MaintenanceComponent';
import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { fetchMaintenanceItem } from '@/lib/actions/maintenance';

interface TaskItemPageProps {
  params: { id: string };
}

export default async function TaskItemPage({ params }: TaskItemPageProps) {
  const assetList = await fetchAssetList();
  const checklistList = await fetchChecklistList(params.id);
  const maintenance = await fetchMaintenanceItem(params.id);
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex flex-col h-full">
      <MaintenanceComponent
        maintenance={maintenance}
        checklistLibraryList={checklistLibrary}
        assetList={assetList}
      >
        <MaintenanceChecklistList checklistList={checklistList} />
      </MaintenanceComponent>
    </div>
  );
}
