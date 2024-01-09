import React from 'react';
import { maintenance } from '@prisma/client';
import {
  fetchChecklistList,
  fetchChecklistLibraryList,
  fetchAssetList,
} from '@/app/api/server-actions';
import MaintenanceChecklistList from '@/components/server/MaintenanceChecklistList';
import TaskMaintenance from '@/components/client/task/TaskMaintenance';

export default async function TaskItemPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: { maintenance: string };
}) {
  const parsedMaintenance = JSON.parse(
    searchParams.maintenance,
  ) satisfies maintenance;

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
