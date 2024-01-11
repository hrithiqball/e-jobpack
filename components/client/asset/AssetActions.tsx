import React, { Key, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import {
  FileBox,
  FilePlus2,
  MoreVertical,
  PackageCheck,
  PackageMinus,
} from 'lucide-react';

import { useCurrentRole } from '@/hooks/use-current-role';
import { Checklist } from '@prisma/client';
import TaskAdd from '@/components/client/task/TaskAdd';

interface AssetActionsProps {
  checklist: Checklist;
}

export default function AssetActions({ checklist }: AssetActionsProps) {
  const role = useCurrentRole();

  const [open, setOpen] = useState(false);

  function handleAction(key: Key) {
    switch (key) {
      case 'add-task':
        setOpen(true);
        break;

      //TODO: implement this
      case 'delete-asset':
        break;

      //TODO: implement this
      case 'close-asset':
        break;

      //TODO: implement this
      case 'import-checklist':
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="faded">
            <MoreVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Actions"
          disabledKeys={
            role === 'ADMIN'
              ? []
              : ['import-checklist', 'delete-asset', 'close-asset']
          }
          onAction={handleAction}
        >
          <DropdownItem key="add-task" startContent={<FilePlus2 size={18} />}>
            Add Task
          </DropdownItem>
          <DropdownItem
            key="import-checklist"
            startContent={<FileBox size={18} />}
          >
            Import checklist
          </DropdownItem>
          <DropdownItem
            key="close-asset"
            startContent={<PackageCheck size={18} />}
          >
            Mark as Close
          </DropdownItem>
          <DropdownItem
            key="delete-asset"
            startContent={<PackageMinus size={18} />}
            color="danger"
          >
            Remove Asset
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <TaskAdd setOpen={setOpen} open={open} checklist={checklist} />
    </div>
  );
}
