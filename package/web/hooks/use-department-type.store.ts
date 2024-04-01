import { DepartmentType, DepartmentTypes } from '@/types/department-enum';
import { create } from 'zustand';

export type DepartmentTypeStore = {
  departmentType: DepartmentType | undefined;
  setDepartmentType: (departmentType: DepartmentType) => void;
  departmentTypes: DepartmentTypes | undefined;
  setDepartmentTypes: (departmentTypes: DepartmentTypes) => void;
};

export const useDepartmentTypeStore = create<DepartmentTypeStore>(set => ({
  departmentType: undefined,
  setDepartmentType: departmentType => {
    set({ departmentType });
  },
  departmentTypes: undefined,
  setDepartmentTypes: departmentTypes => {
    set({ departmentTypes });
  },
}));
