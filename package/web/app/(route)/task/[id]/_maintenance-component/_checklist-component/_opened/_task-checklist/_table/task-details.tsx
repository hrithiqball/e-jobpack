import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useTaskStore } from '@/hooks/use-task.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateTask } from '@/data/task.action';
import { UpdateTask } from '@/lib/schemas/task';
import { isNullOrEmpty } from '@/lib/function/string';

import UpdateTaskForm from './update-task-form';

type ChecklistTaskDetailsProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistTaskDetails({
  open,
  onClose,
}: ChecklistTaskDetailsProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px');
  const user = useCurrentUser();
  const router = useRouter();

  const { currentTask } = useTaskStore();

  const [task, setTask] = useState({
    taskCheck: currentTask?.taskCheck ?? false,
    taskNumber: currentTask?.taskNumberVal ?? 0,
    taskBool: currentTask?.taskBool ?? undefined,
    taskSelectedSingle: currentTask?.taskSelected[0],
    taskSelectedMultiple:
      currentTask?.listChoice.map(choice => ({
        id: uuidv4(),
        selected: currentTask?.taskSelected.includes(choice),
        value: choice,
      })) || [],
  });

  useEffect(() => {
    if (!currentTask) {
      return;
    }

    setTask({
      taskCheck: currentTask.taskCheck ?? false,
      taskNumber: currentTask.taskNumberVal ?? 0,
      taskBool: currentTask.taskBool ?? undefined,
      taskSelectedSingle: currentTask.taskSelected[0],
      taskSelectedMultiple:
        currentTask.listChoice.map(choice => ({
          id: uuidv4(),
          selected: currentTask.taskSelected.includes(choice),
          value: choice,
        })) || [],
    });
  }, [currentTask]);

  if (!currentTask) {
    return null;
  }

  const listChoiceWithId = currentTask.listChoice.map(choice => ({
    id: uuidv4(),
    value: choice,
  }));

  function handleCheckChange() {
    setTask(prev => ({
      ...prev,
      taskCheck: !prev.taskCheck,
    }));
  }

  function handleTaskNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    setTask(prev => ({
      ...prev,
      taskNumber: value,
    }));
  }

  function handleChoiceCheck(id: string) {
    setTask(prev => ({
      ...prev,
      taskSelectedMultiple: prev.taskSelectedMultiple?.map(choice => {
        if (choice.id === id) {
          return {
            ...choice,
            selected: !choice.selected,
          };
        }

        return choice;
      }),
    }));
  }

  function handleChoiceChange(value: string) {
    setTask(prev => ({
      ...prev,
      taskBool: value === '1' ? true : value === '0' ? false : undefined,
    }));
  }

  function handleSelectSingleChange(value: string) {
    setTask(prev => ({
      ...prev,
      taskSelectedSingle: value,
    }));
  }

  function handleUpdate() {
    if (!currentTask) {
      toast.error('Task not found');
      return;
    }

    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      const updatedTask: UpdateTask = {
        taskSelected:
          currentTask.taskType === 'MULTIPLE_SELECT'
            ? task.taskSelectedMultiple
                .filter(choice => choice.selected)
                .map(choice => choice.value)
            : task.taskSelectedSingle
              ? [task.taskSelectedSingle]
              : [],
        taskNumberVal: task.taskNumber,
        taskCheck: task.taskCheck,
        taskBool: task.taskBool,
      };

      toast.promise(updateTask(currentTask.id, user.id, updatedTask), {
        loading: 'Updating task...',
        success: () => {
          router.refresh();
          onClose();
          return 'Task updated';
        },
        error: 'Failed to update task',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetDescription>
            {isNullOrEmpty(currentTask.description) ?? 'No description'}
          </SheetDescription>
        </SheetHeader>
        <UpdateTaskForm
          task={currentTask}
          taskState={task}
          listChoice={listChoiceWithId}
          handleCheckChange={handleCheckChange}
          handleTaskNumberChange={handleTaskNumberChange}
          handleChoiceCheck={handleChoiceCheck}
          handleChoiceChange={handleChoiceChange}
          setTaskSelectedSingle={handleSelectSingleChange}
        />
        <SheetFooter>
          <Button
            variant="outline"
            disabled={transitioning}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription>
            {isNullOrEmpty(currentTask.description) ?? 'No description'}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <UpdateTaskForm
            task={currentTask}
            taskState={task}
            listChoice={listChoiceWithId}
            handleCheckChange={handleCheckChange}
            handleTaskNumberChange={handleTaskNumberChange}
            handleChoiceCheck={handleChoiceCheck}
            handleChoiceChange={handleChoiceChange}
            setTaskSelectedSingle={handleSelectSingleChange}
          />
        </div>
        <DrawerFooter>
          <Button onClick={handleUpdate} disabled={transitioning}>
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
