import { Key } from 'react';

import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Button,
} from '@nextui-org/react';
import {
  MoreVertical,
  PackagePlus,
  FileBox,
  FileDown,
  Table2,
  CheckCircle2,
  FileUp,
  FileSymlink,
} from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentRole } from '@/hooks/use-current-role';

type MaintenanceActionProps = {
  handleAction: (key: Key) => void;
};

export default function MaintenanceAction({
  handleAction,
}: MaintenanceActionProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const role = useCurrentRole();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <MoreVertical size={18} />
        </Button>
      </DropdownTrigger>
      {isDesktop ? (
        // TODO: disable add asset if no more asset can be added
        <DropdownMenu
          color="primary"
          variant="faded"
          disabledKeys={
            role === 'ADMIN' || role === 'SUPERVISOR'
              ? []
              : ['add-asset', 'edit-maintenance']
          }
          onAction={handleAction}
        >
          <DropdownItem
            key="add-asset"
            startContent={<PackagePlus size={18} />}
          >
            Add Checklist
          </DropdownItem>
          <DropdownItem
            key="add-attachment"
            startContent={<FileBox size={18} />}
          >
            Add Attachment
          </DropdownItem>
          <DropdownItem
            key="export-maintenance"
            startContent={<FileSymlink size={18} />}
          >
            Export Maintenance
          </DropdownItem>
          <DropdownItem
            key="download-excel"
            startContent={<FileDown size={18} />}
          >
            {/* TODO: Should not be here if its a request */}
            Download Excel
          </DropdownItem>
          <DropdownItem key="download-pdf" startContent={<Table2 size={18} />}>
            Download PDF
          </DropdownItem>
          <DropdownItem
            key="mark-complete"
            color="success"
            startContent={<CheckCircle2 size={18} />}
          >
            Mark as Complete
          </DropdownItem>
        </DropdownMenu>
      ) : (
        <DropdownMenu
          disabledKeys={
            role === 'ADMIN' || role === 'SUPERVISOR'
              ? []
              : ['add-asset', 'edit-maintenance']
          }
          onAction={handleAction}
        >
          <DropdownItem
            key="add-asset"
            startContent={<PackagePlus size={18} />}
          >
            Add Asset
          </DropdownItem>
          <DropdownItem
            key="add-attachment"
            startContent={<FileBox size={18} />}
          >
            Add Attachment
          </DropdownItem>
          <DropdownItem
            key="download-excel"
            startContent={<FileDown size={18} />}
          >
            Download Excel
          </DropdownItem>
          <DropdownItem key="upload-excel" startContent={<FileUp size={18} />}>
            Upload Excel
          </DropdownItem>
          <DropdownItem key="download-pdf" startContent={<Table2 size={18} />}>
            Download PDF
          </DropdownItem>
          <DropdownItem
            key="mark-complete"
            className="text-success"
            color="success"
            startContent={<CheckCircle2 size={18} />}
          >
            Mark as Complete
          </DropdownItem>
        </DropdownMenu>
      )}
    </Dropdown>
  );
}
