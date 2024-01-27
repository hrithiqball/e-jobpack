import React, { Key } from 'react';

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
} from 'lucide-react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentRole } from '@/hooks/use-current-role';

interface MaintenanceActionProps {
  // eslint-disable-next-line no-unused-vars
  handleAction: (key: Key) => void;
}

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
            key="edit-maintenance"
            startContent={<FileBox size={18} />}
          >
            Edit Asset
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
            className="text-success"
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
            key="edit-maintenance"
            startContent={<FileBox size={18} />}
          >
            Edit Asset
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
            {/* TODO: figure out how to optimize this behavior */}
            {/* <MaintenanceForm maintenance={maintenance} /> */}
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
