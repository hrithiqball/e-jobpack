import { getContactorTypes } from '@/data/contractor-type.action';
import { getContractors } from '@/data/contractor.action';

export type Contractors = Awaited<ReturnType<typeof getContractors>>;
export type ContractorTypes = Awaited<ReturnType<typeof getContactorTypes>>;

export type Contractor = typeof getContractors extends () => Promise<infer T>
  ? T extends Array<infer U>
    ? U
    : never
  : never;