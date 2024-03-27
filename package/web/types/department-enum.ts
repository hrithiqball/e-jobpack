import { getDepartmentTypes } from '@/data/department-type.action';

export type DepartmentTypes = Awaited<ReturnType<typeof getDepartmentTypes>>;
