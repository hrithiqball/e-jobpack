import { fetchMaintenanceList2 } from '@/lib/actions/maintenance';
import { fetchMaintenanceLibraryList } from '@/lib/actions/maintenance-library';
import { fetchTaskLibraryList } from '@/lib/actions/task-library';
import { fetchChecklistLibraryList } from '@/lib/actions/checklist-library';

import MaintenanceLibraryComponent from '@/components/maintenance/MaintenanceLibraryComponent';

export default async function MaintenancePage() {
  const maintenanceLibraryList = await fetchMaintenanceLibraryList();
  const maintenanceList = await fetchMaintenanceList2();
  const taskLibraryList = await fetchTaskLibraryList();
  const checklistLibrary = await fetchChecklistLibraryList();

  return (
    <div className="flex flex-1 flex-col">
      <MaintenanceLibraryComponent
        maintenanceList={maintenanceList}
        maintenanceLibraryList={maintenanceLibraryList}
        taskLibraryList={taskLibraryList}
        checklistLibrary={checklistLibrary}
      />
    </div>
  );
}
