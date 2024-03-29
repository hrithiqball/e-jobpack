import { Checklist, Maintenance } from '@/types/maintenance';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type Task = Checklist['task'][0];

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
  updateTaskInChecklist: (checklistId: string, task: Task) => void;
  addTaskToChecklist: (checklistId: string, task: Task) => void;
  removeTaskFromChecklist: (checklistId: string, taskId: string) => void;
  removeChecklistFromMaintenance: (checklistId: string) => void;
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
  updateTaskInChecklist: (checklistId, task) => {
    set(state => {
      if (!state.maintenance) return state;

      const updatedChecklist = state.maintenance.checklist.map(c =>
        c.id === checklistId
          ? {
              ...c,
              task: c.task.map(t => (t.id === task.id ? { ...t, ...task } : t)),
            }
          : c,
      );

      const updatedMaintenance = {
        ...state.maintenance,
        checklist: updatedChecklist,
      };

      return { ...state, maintenance: updatedMaintenance };
    });
  },
  addTaskToChecklist(checklistId, task) {
    set(state => {
      if (!state.maintenance) return state;

      const updatedChecklist = state.maintenance.checklist.map(c =>
        c.id === checklistId
          ? {
              ...c,
              task: [...c.task, task],
            }
          : c,
      );

      const updateMaintenance = {
        ...state.maintenance,
        checklist: updatedChecklist,
      };

      return { ...state, maintenance: updateMaintenance };
    });
  },
  removeTaskFromChecklist: (checklistId, taskId) => {
    set(state => {
      if (!state.maintenance) return state;

      const updatedChecklist = state.maintenance.checklist.map(c =>
        c.id === checklistId
          ? {
              ...c,
              task: c.task.filter(t => t.id !== taskId),
            }
          : c,
      );

      const updatedMaintenance = {
        ...state.maintenance,
        checklist: updatedChecklist,
      };

      return { ...state, maintenance: updatedMaintenance };
    });
  },
  removeChecklistFromMaintenance: checklistId => {
    set(state => {
      if (!state.maintenance) return state;

      const updatedMaintenance = {
        ...state.maintenance,
        checklist: state.maintenance.checklist.filter(
          c => c.id !== checklistId,
        ),
      };

      return { ...state, maintenance: updatedMaintenance };
    });
  },
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
