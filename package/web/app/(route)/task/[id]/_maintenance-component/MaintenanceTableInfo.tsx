import dayjs from 'dayjs';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { AlarmClock, Contact2 } from 'lucide-react';

import { useMaintenanceStore } from '@/hooks/use-maintenance.store';

export default function MaintenanceTableInfo() {
  const { maintenance } = useMaintenanceStore();

  return (
    maintenance && (
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
    )
  );
}
