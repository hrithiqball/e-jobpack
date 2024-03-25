import { Contractor, Contractors } from '@/types/contractor.type';
import { create } from 'zustand';

type useContractorStore = {
  contractor: Contractor | undefined;
  setContractor: (contractor: Contractor) => void;
  contractors: Contractors | undefined;
  setContractors: (contractors: Contractors) => void;
};

export const useContractorStore = create<useContractorStore>(set => ({
  contractor: undefined,
  setContractor: contractor => {
    set({ contractor });
  },
  contractors: undefined,
  setContractors: contractors => {
    set({ contractors });
  },
}));
