import { MaintenanceAndAssetOptions } from '@/types/maintenance';
import { create } from 'zustand';

type MaintenanceAndAssetOptionsStore = {
  maintenanceAndAssetOptions: MaintenanceAndAssetOptions | null;
  setMaintenanceAndAssetOptions: (
    maintenanceAndAssetOptions: MaintenanceAndAssetOptions,
  ) => void;
};

export const useMaintenanceAndAssetOptionsStore =
  create<MaintenanceAndAssetOptionsStore>(set => ({
    maintenanceAndAssetOptions: null,
    setMaintenanceAndAssetOptions: maintenanceAndAssetOptions => {
      set({ maintenanceAndAssetOptions });
    },
  }));
