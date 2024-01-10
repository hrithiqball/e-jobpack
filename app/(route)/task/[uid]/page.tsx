import React from 'react';
import { Maintenance } from '@prisma/client';

import MaintenanceChecklistList from '@/components/server/MaintenanceChecklistList';
import TaskMaintenance from '@/components/client/task/TaskMaintenance';
import { fetchAssetList } from '@/lib/actions/asset';
import { fetchChecklistList } from '@/lib/actions/checklist';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

export default async function TaskItemPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: { maintenance: string };
}) {
  const parsedMaintenance = JSON.parse(
    searchParams.maintenance,
  ) satisfies Maintenance;

  const assetList = await fetchAssetList();
  const checklistList = await fetchChecklistList(params.uid);
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex flex-col h-full">
      <TaskMaintenance
        maintenance={parsedMaintenance}
        checklistLibraryList={checklistLibrary}
        assetList={assetList}
      >
        <MaintenanceChecklistList checklistList={checklistList} />
      </TaskMaintenance>
    </div>
  );
}
