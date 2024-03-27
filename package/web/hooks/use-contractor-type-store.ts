import { ContractorTypes } from '@/types/contractor.type';
import { create } from 'zustand';

type useContractorTypeStore = {
  contractorTypes: ContractorTypes | undefined;
  setContractorTypes: (contractorTypes: ContractorTypes) => void;
};

export const useContractorTypeStore = create<useContractorTypeStore>(set => ({
  contractorTypes: undefined,
  setContractorTypes: contractorTypes => {
    set({ contractorTypes });
  },
}));
