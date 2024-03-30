import { create } from 'zustand';
import { Histories } from '@/types/history';

type useHistoryStore = {
  histories: Histories | undefined;
  setHistories: (histories: Histories) => void;
};

export const useHistoryStore = create<useHistoryStore>(set => ({
  histories: undefined,
  setHistories: histories => {
    set({ histories });
  },
}));
