import {
  FaClipboardList,
  FaTasks,
  FaCheck,
  FaWrench,
  FaToolbox,
  FaBarcode,
  FaDatabase,
  FaListUl,
  FaRegCalendarCheck,
  FaRegListAlt,
} from 'react-icons/fa';

type IconType =
  | typeof FaClipboardList
  | typeof FaTasks
  | typeof FaCheck
  | typeof FaWrench
  | typeof FaToolbox
  | typeof FaBarcode
  | typeof FaDatabase
  | typeof FaListUl
  | typeof FaRegCalendarCheck
  | typeof FaRegListAlt;

export interface IconChoice {
  id: number;
  name: string;
  icon: IconType;
}

export const iconChoice: IconChoice[] = [
  {
    id: 1,
    name: 'Clipboard List',
    icon: FaClipboardList,
  },
  {
    id: 2,
    name: 'Tasks',
    icon: FaTasks,
  },
  {
    id: 3,
    name: 'Check',
    icon: FaCheck,
  },
  {
    id: 4,
    name: 'Wrench',
    icon: FaWrench,
  },
  {
    id: 5,
    name: 'Toolbox',
    icon: FaToolbox,
  },
  {
    id: 6,
    name: 'Barcode',
    icon: FaBarcode,
  },
  {
    id: 7,
    name: 'Database',
    icon: FaDatabase,
  },
  {
    id: 8,
    name: 'List Unordered',
    icon: FaListUl,
  },
  {
    id: 9,
    name: 'Calendar',
    icon: FaRegCalendarCheck,
  },
  {
    id: 10,
    name: 'List',
    icon: FaRegListAlt,
  },
];
