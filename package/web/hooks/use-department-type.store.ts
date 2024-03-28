import { DepartmentTypes } from '@/types/department-enum';
import { create } from 'zustand';

export type DepartmentTypeStore = {
  departmentTypes: DepartmentTypes | undefined;
  setDepartmentTypes: (departmentTypes: DepartmentTypes) => void;
};

export const useDepartmentTypeStore = create<DepartmentTypeStore>(set => ({
  departmentTypes: undefined,
  setDepartmentTypes: departmentTypes => {
    set({ departmentTypes });
  },
}));
