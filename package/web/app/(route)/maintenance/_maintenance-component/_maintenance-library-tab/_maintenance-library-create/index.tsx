import { MaintenanceLibraryList } from '@/types/maintenance';
import { TaskLibraryList } from '@/types/task';

type MaintenanceLibraryCreateProps = {
  maintenanceLibraryList: MaintenanceLibraryList;
  taskLibraryList: TaskLibraryList;
};

export default function MaintenanceLibraryCreate({
  maintenanceLibraryList,
  taskLibraryList,
}: MaintenanceLibraryCreateProps) {
  return (
    <div>
      {maintenanceLibraryList.length} {taskLibraryList.length}
    </div>
  );
}
