import { DepartmentTypes } from '@/types/department-enum';
import { create } from 'zustand';

export type DepartmentTypeStore = {
  departmentTypes: DepartmentTypes | undefined;
  setDepartments: (departmentTypes: DepartmentTypes) => void;
};

export const useDepartmentTypeStore = create<DepartmentTypeStore>(set => ({
  departmentTypes: undefined,
  setDepartments: departmentTypes => {
    set({ departmentTypes });
  },
}));
