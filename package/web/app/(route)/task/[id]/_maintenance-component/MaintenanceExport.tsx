import { useState, useTransition } from 'react';

import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

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

import { MaintenanceAndAssetOptions } from '@/types/maintenance';
import { CreateMaintenanceLibrary } from '@/lib/schemas/maintenance';
import { ChecklistSchema } from '@/lib/schemas/checklist';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import { createMaintenanceLibrary } from '@/lib/actions/maintenance-library';

type MaintenanceExportProps = {
  maintenance: MaintenanceAndAssetOptions;
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceExport({
  maintenance,
  open,
  onClose,
}: MaintenanceExportProps) {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

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

  function handleSave() {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session is expired');
        return;
      }

      const checklistLibraries: z.infer<typeof ChecklistSchema>[] = [];

      selectedChecklists
        .filter(checklist => checklist.isSelected)
        .forEach(checklist => {
          const checklistId = uuidv4();

          const checklistLibrary = {
            id: checklistId,
            title: checklist.asset.name,
            description: checklist.asset.description,
            assetId: checklist.asset.id,
            createdById: user.id,
            updatedById: user.id,
            taskLibrary: checklist.task.map(task => {
              const taskId = uuidv4();

              return {
                id: taskId,
                checklistLibraryId: checklistId,
                taskActivity: task.taskActivity,
                description: task.description,
                taskOrder: task.taskOrder,
                taskType: task.taskType,
                createdById: user.id,
                updatedById: user.id,
                listChoice:
                  task.taskType === 'MULTIPLE_SELECT' ||
                  task.taskType === 'SINGLE_SELECT'
                    ? task.listChoice
                    : [],
                subtaskLibrary: task.subtask.map(subtask => {
                  return {
                    taskLibraryId: taskId,
                    id: uuidv4(),
                    taskActivity: subtask.taskActivity,
                    description: subtask.description,
                    taskOrder: subtask.taskOrder,
                    taskType: subtask.taskType,
                    createdById: user.id,
                    updatedById: user.id,
                    listChoice:
                      subtask.taskType === 'MULTIPLE_SELECT' ||
                      subtask.taskType === 'SINGLE_SELECT'
                        ? subtask.listChoice
                        : [],
                  };
                }),
              };
            }),
          };

          const validatedChecklist =
            ChecklistSchema.safeParse(checklistLibrary);

          if (!validatedChecklist.success) {
            console.log(validatedChecklist.error);
            return;
          }

          checklistLibraries.push(validatedChecklist.data);
        });

      const newMaintenanceLibrary: CreateMaintenanceLibrary = {
        title,
        description,
        createdById: user.id,
        updatedById: user.id,
        checklistLibrary: checklistLibraries,
      };

      toast.promise(createMaintenanceLibrary(newMaintenanceLibrary), {
        loading: 'Creating maintenance library...',
        success: res => {
          onClose();
          return `Maintenance ${res.title} library successfully created!`;
        },
        error: 'Failed to create maintenance library 😢',
      });
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
