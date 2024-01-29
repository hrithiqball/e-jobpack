import { fetchMaintenanceList2 } from '@/lib/actions/maintenance';
import { fetchMaintenanceLibraryList } from '@/lib/actions/maintenance-library';
import MaintenanceLibraryComponent from '@/components/maintenance/MaintenanceLibraryComponent';

export default async function DashboardPage() {
  const maintenanceLibraryList = await fetchMaintenanceLibraryList();
  const maintenanceList = await fetchMaintenanceList2();

  return (
    <div className="flex flex-1 flex-col">
      <MaintenanceLibraryComponent
        maintenanceList={maintenanceList}
        maintenanceLibraryList={maintenanceLibraryList}
      />
    </div>
  );
}
