import { Maintenance } from '@/types/maintenance';
import { create } from 'zustand';

type MaintenanceStore = {
  maintenance: Maintenance | null;
  setMaintenance: (maintenanceAndAssetOptions: Maintenance) => void;
};

export const useMaintenanceStore = create<MaintenanceStore>(set => ({
  maintenance: null,
  setMaintenance: maintenance => {
    set({ maintenance });
  },
}));
