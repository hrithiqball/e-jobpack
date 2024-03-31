import { create } from 'zustand';
import { MaintenanceLibraryItem } from '@/types/maintenance';

type MaintenanceLibStore = {
  maintenanceLib: MaintenanceLibraryItem | undefined;
  setMaintenanceLib: (maintenanceLib: MaintenanceLibraryItem) => void;
};

export const useMaintenanceLibStore = create<MaintenanceLibStore>(set => ({
  maintenanceLib: undefined,
  setMaintenanceLib: maintenanceLib => {
    set({ maintenanceLib });
  },
}));
