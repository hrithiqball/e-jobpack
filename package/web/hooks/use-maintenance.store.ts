import { Checklist, Maintenance } from '@/types/maintenance';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ChecklistStore = {
  id: string;
  assetId: string | null;
  assetTitle: string | undefined;
  checklistId: string | null;
  checklistTitle: string | undefined;
};

type MaintenanceStore = {
  maintenance: Maintenance | null;
  setMaintenance: (maintenanceAndAssetOptions: Maintenance) => void;
  currentChecklist: Checklist | null;
  setCurrentChecklist: (checklist: Checklist) => void;
  checklistSelected: ChecklistStore[];
  clearChecklistSelected: () => void;
  addChecklistSelected: () => void;
  removeChecklistSelected: (id: string) => void;
  updateChecklist: (
    id: string,
    checklistId: string,
    checklistTitle: string | undefined,
  ) => void;
  updateAsset: (
    id: string,
    assetId: string,
    assetTitle: string | undefined,
  ) => void;
};

export const useMaintenanceStore = create<MaintenanceStore>(set => ({
  maintenance: null,
  setMaintenance: maintenance => {
    set({ maintenance });
  },
  currentChecklist: null,
  setCurrentChecklist: checklist => {
    set({ currentChecklist: checklist });
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
  updateChecklist: (id, checklistId, checklistTitle) => {
    set(state => {
      const newChecklistSelected = state.checklistSelected.map(checklist => {
        if (checklist.id === id) {
          return { ...checklist, checklistId, checklistTitle };
        }
        return checklist;
      });
      return { checklistSelected: newChecklistSelected };
    });
  },
  updateAsset: (id, assetId, assetTitle) => {
    set(state => {
      const newChecklistSelected = state.checklistSelected.map(checklist => {
        if (checklist.id === id) {
          return { ...checklist, assetId, assetTitle };
        }
        return checklist;
      });
      return { checklistSelected: newChecklistSelected };
    });
  },
}));
