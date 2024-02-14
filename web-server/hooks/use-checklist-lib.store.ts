import { ChecklistLibraryList } from '@/types/checklist';
import { create } from 'zustand';

type useChecklistLibStore = {
  checklistLibraryList: ChecklistLibraryList;
  setChecklistLibraryList: (checklistLibraryList: ChecklistLibraryList) => void;
};

export const useChecklistLibStore = create<useChecklistLibStore>(set => ({
  checklistLibraryList: [],
  setChecklistLibraryList: checklistLibraryList => {
    set({ checklistLibraryList });
  },
}));
