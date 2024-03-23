import { fetchMaintenanceList } from '@/data/maintenance.action';
import { fetchMaintenanceLibraryList } from '@/data/maintenance-library.action';
import { fetchTaskLibraryList } from '@/data/task-library.action';
import { fetchChecklistLibraryList } from '@/data/checklist-library.action';
import { fetchUserList } from '@/data/user.action';
import { fetchAssetList } from '@/data/asset.action';

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
