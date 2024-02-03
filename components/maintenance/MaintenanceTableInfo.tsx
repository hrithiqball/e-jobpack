import dayjs from 'dayjs';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/tableT';
import { AlarmClock, Contact2 } from 'lucide-react';

import { MutatedMaintenance } from '@/types/maintenance';

type MaintenanceTableInfoProps = {
  maintenance: MutatedMaintenance;
};

export default function MaintenanceTableInfo({
  maintenance,
}: MaintenanceTableInfoProps) {
  return (
    <Table aria-label="Asset info table">
      <TableBody>
        <TableRow key="deadline" className="bg-gray-50 dark:bg-gray-800">
          <TableCell className="flex items-center space-x-2">
            <AlarmClock size={18} />
            <span className="font-bold">Deadline</span>
          </TableCell>
          <TableCell>
            <span>
              {maintenance.deadline
                ? dayjs(maintenance.deadline).format('DD/MM/YYYY hh:mmA')
                : 'Not Specified'}
            </span>
          </TableCell>
        </TableRow>
        <TableRow key="person-in-charge">
          <TableCell className="flex items-center space-x-2">
            <Contact2 size={18} />
            <span className="font-bold">Person in charge</span>
          </TableCell>
          <TableCell>
            <span>Harith Iqbal</span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
