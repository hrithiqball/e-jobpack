import { Key, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

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
  FileSymlink,
  ImagePlus,
  MoreVertical,
  PackageCheck,
  PackageMinus,
} from 'lucide-react';
import { toast } from 'sonner';

import { MutatedMaintenance } from '@/types/maintenance';
import { ChecklistLibraryList } from '@/types/checklist';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateChecklist } from '@/lib/actions/checklist';

import TaskAdd from './TaskAdd';
import ChecklistExportModal from './ChecklistExportModal';
import ChecklistImport from './ChecklistImport';

type AssetActionsProps = {
  checklist: MutatedMaintenance['checklist'][0];
  checklistLibraryList: ChecklistLibraryList;
};

export default function ChecklistActions({
  checklist,
  checklistLibraryList,
}: AssetActionsProps) {
  const [transitioning, startTransition] = useTransition();
  const router = useRouter();
  const role = useCurrentRole();
  const user = useCurrentUser();

  const [isTaskAddOpenModal, setIsTaskAddOpenModal] = useState(false);
  const [isChecklistImportOpen, setIsChecklistImportOpen] = useState(false);
  const [isChecklistExportModalOpen, setIsChecklistExportModalOpen] =
    useState(false);

  function handleAction(key: Key) {
    switch (key) {
      case 'add-task':
        setIsTaskAddOpenModal(true);
        break;

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
              updatedById: user.id,
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
          if (!transitioning) {
            console.log('success');
          }
        });
        break;

      case 'import-checklist':
        setIsChecklistImportOpen(true);
        break;

      case 'export-checklist':
        setIsChecklistExportModalOpen(true);
        break;
    }
  }

  function handleCloseTaskAddModal() {
    setIsTaskAddOpenModal(false);
  }

  function handleCloseChecklistExportModal() {
    setIsChecklistExportModalOpen(false);
  }

  function handleCloseChecklistImport() {
    setIsChecklistImportOpen(false);
  }

  function handleChecklistUpdate() {
    setIsChecklistImportOpen(false);
    router.refresh();
  }

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <MoreVertical size={18} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Actions"
          color="primary"
          disabledKeys={
            role === 'ADMIN' || role === 'SUPERVISOR'
              ? []
              : [
                  'import-checklist',
                  'export-checklist',
                  'delete-asset',
                  'close-checklist',
                ]
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
            key="export-checklist"
            variant="faded"
            startContent={<FileSymlink size={18} />}
          >
            Export Checklist
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
            color="danger"
            startContent={<PackageMinus size={18} />}
          >
            Remove Asset
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <TaskAdd
        open={isTaskAddOpenModal}
        onClose={handleCloseTaskAddModal}
        checklist={checklist}
      />
      <ChecklistExportModal
        open={isChecklistExportModalOpen}
        onClose={handleCloseChecklistExportModal}
        checklist={checklist}
      />
      <ChecklistImport
        open={isChecklistImportOpen}
        onClose={handleCloseChecklistImport}
        onUpdate={handleChecklistUpdate}
        checklistId={checklist.id}
        checklistLibraryList={checklistLibraryList}
      />
    </div>
  );
}
