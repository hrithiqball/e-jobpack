import { Maintenance } from '@/types/maintenance';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type ChecklistStore = {
  id: string;
  assetId: string | null;
  assetTitle: string;
  checklistId: string | null;
  checklistTitle: string;
};

type MaintenanceStore = {
  maintenance: Maintenance | null;
  setMaintenance: (maintenanceAndAssetOptions: Maintenance) => void;
  checklistSelected: ChecklistStore[];
  clearChecklistSelected: () => void;
  addChecklistSelected: () => void;
  removeChecklistSelected: (id: string) => void;
  updateChecklistId: (assetId: string, checklistId: string) => void;
};

export const useMaintenanceStore = create<MaintenanceStore>(set => ({
  maintenance: null,
  setMaintenance: maintenance => {
    set({ maintenance });
  },
  checklistSelected: [],
  clearChecklistSelected: () => {
    set({ checklistSelected: [] });
  },
  addChecklistSelected: () => {
    set(state => {
      const newChecklistSelected = [
        ...state.checklistSelected,
        {
          id: uuidv4(),
          assetId: null,
          assetTitle: '',
          checklistId: null,
          checklistTitle: '',
        },
      ];
      return { checklistSelected: newChecklistSelected };
    });
  },
  removeChecklistSelected: id => {
    set(state => {
      const newChecklistSelected = state.checklistSelected.filter(
        checklist => checklist.id !== id,
      );
      return { checklistSelected: newChecklistSelected };
    });
  },
  updateChecklistId: (assetId, checklistId) => {
    set(state => {
      const newChecklistSelected = state.checklistSelected.map(checklist => {
        if (checklist.assetId === assetId) {
          return { ...checklist, checklistId };
        }
        return checklist;
      });
      return { checklistSelected: newChecklistSelected };
    });
  },
}));
