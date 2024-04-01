import { getDepartmentTypes } from '@/data/department-type.action';

export type DepartmentTypes = Awaited<ReturnType<typeof getDepartmentTypes>>;
export type DepartmentType = DepartmentTypes[0];
