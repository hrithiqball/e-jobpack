import React, { Key, useState, useTransition } from 'react';
import { Checklist } from '@prisma/client';
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
  ImagePlus,
  MoreVertical,
  PackageCheck,
  PackageMinus,
} from 'lucide-react';
import { toast } from 'sonner';

import TaskAdd from '@/components/task/TaskAdd';
import { updateChecklist } from '@/lib/actions/checklist';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';

interface AssetActionsProps {
  checklist: Checklist;
}

export default function AssetActions({ checklist }: AssetActionsProps) {
  let [isPending, startTransition] = useTransition();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const [open, setOpen] = useState(false);

  function handleAction(key: Key) {
    switch (key) {
      case 'add-task':
        setOpen(true);
        break;

      //TODO: implement this
      case 'delete-asset':
        break;

      case 'close-checklist':
        startTransition(() => {
          if (user === undefined || user.id === undefined) {
            toast.error('Session expired');
            return;
          }

          toast.promise(
            updateChecklist(checklist.id, {
              updatedBy: user.id,
              isClose: true,
            }),
            {
              loading: 'Closing checklist...',
              success: res => {
                return `${res.assetId} is closed!`;
              },
              error: 'Failed to close checklist 😥',
            },
          );
          if (!isPending) {
            console.log('success');
          }
        });
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
            role === 'ADMIN' || role === 'SUPERVISOR'
              ? []
              : ['import-checklist', 'delete-asset', 'close-checklist']
          }
          onAction={handleAction}
        >
          <DropdownItem
            key="add-task"
            variant="faded"
            startContent={<FilePlus2 size={18} />}
          >
            Add Task
          </DropdownItem>
          <DropdownItem
            key="add-attachment"
            variant="faded"
            startContent={<ImagePlus size={18} />}
          >
            Add Attachment
          </DropdownItem>
          <DropdownItem
            key="import-checklist"
            variant="faded"
            startContent={<FileBox size={18} />}
          >
            Import checklist
          </DropdownItem>
          <DropdownItem
            key="close-checklist"
            variant="faded"
            startContent={<PackageCheck size={18} />}
          >
            Mark as Close
          </DropdownItem>
          <DropdownItem
            key="delete-asset"
            variant="faded"
            className="text-danger"
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
