import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

export default function MaintenanceEit() {
  const { maintenance } = useMaintenanceStore();

  return maintenance && <div>maintenance-edit {maintenance.id}</div>;
}
