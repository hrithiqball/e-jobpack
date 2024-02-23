import { ChecklistLibraryItem, ChecklistLibraryList } from '@/types/checklist';
import { create } from 'zustand';

type useChecklistLibStore = {
  checklistLibraryList: ChecklistLibraryList;
  setChecklistLibraryList: (checklistLibraryList: ChecklistLibraryList) => void;
  currentChecklistLibrary: ChecklistLibraryItem | null;
  setCurrentChecklistLibrary: (
    currentChecklistLibrary: ChecklistLibraryItem | null,
  ) => void;
};

export const useChecklistLibStore = create<useChecklistLibStore>(set => ({
  checklistLibraryList: [],
  setChecklistLibraryList: checklistLibraryList => {
    set({ checklistLibraryList });
  },
  currentChecklistLibrary: null,
  setCurrentChecklistLibrary: currentChecklistLibrary => {
    set({ currentChecklistLibrary });
  },
}));
