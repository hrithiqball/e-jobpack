import { Key, Fragment } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import {
  BookOpen,
  CheckCircle2,
  FileDown,
  FileSymlink,
  ImageIcon,
  MoreVertical,
  PackagePlus,
  Pen,
  Table2,
  UserRoundCheck,
} from 'lucide-react';

import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { useCurrentRole } from '@/hooks/use-current-role';

type MaintenanceDropdownProps = {
  handleAction: (key: Key) => void;
};

export default function MaintenanceDropdown({
  handleAction,
}: MaintenanceDropdownProps) {
  const role = useCurrentRole();

  const { maintenance } = useMaintenanceStore();

  return (
    role &&
    maintenance && (
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="mx-4 w-56 p-2">
          {role !== 'TECHNICIAN' && (
            <Fragment>
              <PopoverItem
                onClick={() => handleAction('edit-maintenance')}
                startContent={<Pen size={18} />}
              >
                Edit Maintenance
              </PopoverItem>
              <PopoverItem
                onClick={() => handleAction('add-checklist')}
                startContent={<PackagePlus size={18} />}
              >
                Add Checklist
              </PopoverItem>
            </Fragment>
          )}

          <PopoverItem
            onClick={() => handleAction('add-attachment')}
            startContent={<ImageIcon size={18} />}
          >
            Add Attachment
          </PopoverItem>
          <PopoverItem
            onClick={() => handleAction('export-maintenance')}
            startContent={<FileSymlink size={18} />}
          >
            Export Maintenance
          </PopoverItem>
          <PopoverItem
            onClick={() => handleAction('download-excel')}
            startContent={<FileDown size={18} />}
          >
            Download Excel
          </PopoverItem>
          <PopoverItem
            onClick={() => handleAction('download-pdf')}
            startContent={<Table2 size={18} />}
          >
            Download PDF
          </PopoverItem>
          {maintenance.maintenanceStatus === 'CLOSED' ? (
            <PopoverItem
              onClick={() => handleAction('reopen-maintenance')}
              startContent={<BookOpen size={18} />}
            >
              Reopen Maintenance
            </PopoverItem>
          ) : (
            <PopoverItem
              onClick={() => handleAction('mark-complete')}
              startContent={<CheckCircle2 size={18} />}
            >
              Mark As Complete
            </PopoverItem>
          )}
          {role !== 'TECHNICIAN' &&
            maintenance.maintenanceStatus === 'CLOSED' && (
              <PopoverItem
                onClick={() => handleAction('approve-completion')}
                startContent={<UserRoundCheck size={18} />}
              >
                Approve Completion
              </PopoverItem>
            )}
        </PopoverContent>
      </Popover>
    )
  );
}
