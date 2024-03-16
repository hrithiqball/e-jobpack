import { fetchMaintenanceList } from '@/lib/actions/maintenance';
import { fetchMaintenanceLibraryList } from '@/lib/actions/maintenance-library';
import { fetchTaskLibraryList } from '@/lib/actions/task-library';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';
import { fetchUserList } from '@/lib/actions/user';
import { fetchAssetList } from '@/lib/actions/asset';

import MaintenanceComponent from './_component';

export default async function MaintenancePage() {
  const maintenanceLibraryList = await fetchMaintenanceLibraryList();
  const maintenanceList = await fetchMaintenanceList();
  const taskLibraryList = await fetchTaskLibraryList();
  const checklistLibrary = await fetchChecklistLibraryList();
  const userList = await fetchUserList();
  const assetList = await fetchAssetList();

  return (
    <div className="flex flex-1 flex-col">
      <MaintenanceComponent
        maintenanceList={maintenanceList}
        maintenanceLibraryList={maintenanceLibraryList}
        taskLibraryList={taskLibraryList}
        checklistLibrary={checklistLibrary}
        userList={userList}
        assetList={assetList}
      />
    </div>
  );
}
