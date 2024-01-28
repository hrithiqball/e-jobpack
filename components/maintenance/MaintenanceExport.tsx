import { useState, useTransition } from 'react';

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

import { MutatedMaintenance } from '@/types/maintenance';

interface MaintenanceExportProps {
  maintenance: MutatedMaintenance;
  open: boolean;
  onClose: () => void;
}

export default function MaintenanceExport({
  maintenance,
  open,
  onClose,
}: MaintenanceExportProps) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedChecklists, setSelectedChecklists] = useState(
    maintenance.checklist.map(checklist => ({
      id: checklist.id,
      asset: checklist.asset,
      isSelected: true,
      task: checklist.task.map(task => ({
        ...task,
        subtask: task.subtask.map(subtask => ({
          ...subtask,
        })),
      })),
    })),
  );

  // TODO: major chore needed to be done here to create checklist schema
  function handleSave() {
    startTransition(() => {
      console.log('Selected checklists:', selectedChecklists);

      const checklistLibraries = [];

      selectedChecklists
        .filter(checklist => checklist.isSelected)
        .forEach(checklist => {
          const checklistLibrary = {
            title: checklist.asset.name,
            description: checklist.asset.description,
          };

          checklistLibraries.push(checklistLibrary);
        });

      onClose();
    });
  }

  function toggleChecklist(checklistId: string) {
    setSelectedChecklists(checklists =>
      checklists.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              isSelected: !checklist.isSelected,
            }
          : checklist,
      ),
    );
  }

  return (
    <Modal hideCloseButton backdrop="blur" isOpen={open}>
      <ModalContent>
        <ModalHeader>Export Maintenance</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            size="sm"
            variant="faded"
            label="Title"
            isDisabled={isPending}
            value={title}
            onValueChange={setTitle}
          />
          <Input
            size="sm"
            variant="faded"
            label="Description"
            isDisabled={isPending}
            value={description}
            onValueChange={setDescription}
          />
          {maintenance.checklist.map(checklist => (
            <Checkbox
              key={checklist.id}
              isSelected={
                selectedChecklists.find(
                  selectedChecklist => selectedChecklist.id === checklist.id,
                )?.isSelected
              }
              onValueChange={() => toggleChecklist(checklist.id)}
            >
              {checklist.asset.name}
            </Checkbox>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="faded"
            size="sm"
            color="danger"
            isDisabled={isPending}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="faded"
            size="sm"
            color="primary"
            isDisabled={isPending || !title}
            onClick={handleSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
