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
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { MutatedMaintenance } from '@/types/maintenance';
import {
  CreateChecklistLibrary,
  CreateChecklistLibrarySchema,
} from '@/lib/schemas/checklist';
import { CreateTaskLibrary, CreateTaskLibrarySchema } from '@/lib/schemas/task';
import {
  CreateSubtaskLibrary,
  CreateSubtaskLibrarySchema,
} from '@/lib/schemas/subtask';
import { createChecklistLibrary } from '@/lib/actions/checklist-library';

interface ChecklistExportModalProps {
  open: boolean;
  onClose: () => void;
  checklist: MutatedMaintenance['checklist'][0];
}

export default function ChecklistExportModal({
  open,
  onClose,
  checklist,
}: ChecklistExportModalProps) {
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const [checklistLibraryTitle, setChecklistLibraryTitle] = useState('');
  const [checklistLibraryDescription, setChecklistLibraryDescription] =
    useState('');
  const [selectedTasks, setSelectedTasks] = useState(
    checklist.task.map(task => ({
      id: task.id,
      taskActivity: task.taskActivity,
      description: task.description,
      taskType: task.taskType,
      listChoice: task.listChoice,
      isSelected: true,
      subtask: task.subtask.map(subtask => ({
        ...subtask,
        isSelected: true,
      })),
    })),
  );

  function handleSave() {
    try {
      startTransition(() => {
        if (user === undefined) {
          toast.error('Session expired!');
          return;
        }

        const newChecklist: CreateChecklistLibrary = {
          title: checklistLibraryTitle,
          description: checklistLibraryDescription,
        };

        const taskList: CreateTaskLibrary[] = [];
        const subtaskList: CreateSubtaskLibrary[] = [];

        selectedTasks
          .filter(task => task.isSelected)
          .forEach(task => {
            const taskLibrary = {
              taskActivity: task.taskActivity,
              description: task.description,
              taskType: task.taskType,
              listChoice:
                task.taskType === 'MULTIPLE_SELECT' ||
                task.taskType === 'SINGLE_SELECT'
                  ? task.listChoice
                  : [],
            } satisfies CreateTaskLibrary;

            const filteredSubtasks = task.subtask.filter(
              subtask => subtask.isSelected,
            );
            const subtaskLibraries: CreateSubtaskLibrary[] =
              filteredSubtasks.map(subtask => ({
                taskActivity: subtask.taskActivity,
                description: subtask.description,
                taskType: subtask.taskType,
                listChoice:
                  subtask.taskType === 'MULTIPLE_SELECT' ||
                  subtask.taskType === 'SINGLE_SELECT'
                    ? subtask.listChoice
                    : [],
              }));

            subtaskList.push(...subtaskLibraries);
            taskList.push(taskLibrary);
          });

        const validatedChecklist =
          CreateChecklistLibrarySchema.safeParse(newChecklist);

        if (!validatedChecklist.success) {
          toast.error(validatedChecklist.error.message);
          return;
        }

        const validatedTasks = taskList.map(task =>
          CreateTaskLibrarySchema.safeParse(task),
        );

        if (validatedTasks.some(result => !result.success)) {
          toast.error('Validation failed. Please check your input.');
          return;
        }

        const validatedSubtasks = subtaskList.map(subtask =>
          CreateSubtaskLibrarySchema.safeParse(subtask),
        );

        if (validatedSubtasks.some(result => !result.success)) {
          toast.error('Validation failed. Please check your input.');
          return;
        }

        toast.promise(
          createChecklistLibrary(
            user.id,
            checklist.asset.id,
            validatedChecklist.data,
            taskList,
            subtaskList,
          ),
          {
            loading: 'Saving...',
            success: res => {
              return `${res.title} has been saved!`;
            },
            error: 'Something went wrong, please try again later.',
          },
        );
      });
    } catch (error) {
      toast.error('Something went wrong, please try again later.');
    } finally {
      onClose();
    }
  }

  function toggleTask(taskId: string) {
    setSelectedTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, isSelected: !task.isSelected } : task,
      ),
    );
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    setSelectedTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtask: task.subtask.map(subtask =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      isSelected: !subtask.isSelected,
                    }
                  : subtask,
              ),
            }
          : task,
      ),
    );
  }

  return (
    <Modal isOpen={open} hideCloseButton backdrop="blur">
      <ModalContent>
        <ModalHeader>Export as library</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            variant="faded"
            label="Library name"
            placeholder='e.g. "My Checklist Library"'
            value={checklistLibraryTitle}
            onValueChange={setChecklistLibraryTitle}
          />
          <Input
            variant="faded"
            label="Description"
            value={checklistLibraryDescription}
            onValueChange={setChecklistLibraryDescription}
          />
          {checklist.task.map(task => (
            <div key={task.id} className="flex items-center">
              <Checkbox
                isSelected={
                  selectedTasks.find(
                    selectedTask => selectedTask.id === task.id,
                  )?.isSelected
                }
                onValueChange={() => toggleTask(task.id)}
              >
                {task.taskActivity}
              </Checkbox>
              {task.subtask.map(subtask => (
                <div key={subtask.id} className="flex items-center">
                  <Checkbox
                    isSelected={
                      selectedTasks.find(
                        selectedTask =>
                          selectedTask.id === task.id &&
                          selectedTask.subtask.find(
                            selectedSubtask =>
                              selectedSubtask.id === subtask.id,
                          ),
                      )?.isSelected
                    }
                    onValueChange={() => toggleSubtask(task.id, subtask.id)}
                  >
                    {subtask.taskActivity}
                  </Checkbox>
                </div>
              ))}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="faded"
            color="danger"
            isDisabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="faded"
            color="primary"
            isDisabled={isPending || checklistLibraryTitle === ''}
            onClick={handleSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
