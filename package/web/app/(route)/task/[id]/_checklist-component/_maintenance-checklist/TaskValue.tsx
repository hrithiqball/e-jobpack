/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useTransition } from 'react';

import { z } from 'zod';

import { Checkbox, Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { toast } from 'sonner';

import { TaskItem } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateTask } from '@/lib/actions/task';
import { UpdateTask } from '@/lib/schemas/task';

type TaskValueProps = {
  task: TaskItem;
};

export default function TaskValue({ task }: TaskValueProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const [taskIsComplete, setTaskIsComplete] = useState(task.isComplete);
  const [taskBool, setTaskBool] = useState(task.taskBool ?? false);
  const [taskSelected, setTaskSelected] = useState<string[]>(task.taskSelected);
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    task.taskNumberVal?.toString() ?? '',
  );

  function handleUpdateTask(updatedTask: z.infer<typeof UpdateTask>) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('Session expired');
        return;
      }

      toast.promise(updateTask(task.id, user.id, updatedTask), {
        loading: 'Updating task...',
        success: 'Task updated',
        error: 'Failed to update task',
      });
    });
  }

  function handleSelectionChange(val: any) {
    const changedValue = [val.currentKey as string];

    if (
      changedValue.length !== taskSelected.length &&
      changedValue.every((value, index) => value === taskSelected[index])
    ) {
      setTaskSelected(changedValue);
      const validatedFields = UpdateTask.safeParse({
        taskSelected: changedValue,
      });

      if (!validatedFields.success) {
        toast.error(validatedFields.error?.issues[0]?.message);
        return;
      }

      startTransition(() => {
        if (user === undefined || user.id === undefined) {
          toast.error('Session expired');
          return;
        }

        toast.promise(
          updateTask(task.id, user.id, { ...validatedFields.data }),
          {
            loading: 'Updating task...',
            success: 'Task updated',
            error: 'Failed to update task',
          },
        );
      });
    }
  }

  switch (task.taskType) {
    case 'CHECK':
      return (
        <Checkbox
          isDisabled={transitioning}
          aria-label="Task Checkbox"
          isSelected={taskIsComplete}
          onValueChange={() => {
            setTaskIsComplete(!taskIsComplete);
            const updatedTask: z.infer<typeof UpdateTask> = {
              isComplete: !taskIsComplete,
            };
            handleUpdateTask(updatedTask);
          }}
        />
      );

    case 'CHOICE':
      return (
        <Switch
          size="sm"
          aria-label="Task Switch"
          className="flex-1"
          isSelected={taskBool}
          onValueChange={() => {
            setTaskBool(!taskBool);
            const taskUpdate: z.infer<typeof UpdateTask> = {
              taskBool: !taskBool,
            };
            handleUpdateTask(taskUpdate);
          }}
        />
      );

    case 'SINGLE_SELECT':
    case 'MULTIPLE_SELECT':
      return (
        <Select
          aria-label="Task Select"
          variant="faded"
          selectedKeys={taskSelected}
          selectionMode={
            task.taskType === 'MULTIPLE_SELECT' ? 'multiple' : 'single'
          }
          onSelectionChange={handleSelectionChange}
          size="sm"
          placeholder="Choose one"
        >
          {task.listChoice.map(choice => (
            <SelectItem key={choice} value={choice}>
              {choice}
            </SelectItem>
          ))}
        </Select>
      );

    case 'NUMBER': {
      const isNumber =
        !isNaN(parseFloat(taskNumberValue)) && taskNumberValue.trim() !== '';

      return (
        <Input
          aria-label="Task Number"
          variant="faded"
          isInvalid={!isNumber}
          errorMessage="Please enter a valid number"
          color={!isNumber ? 'danger' : 'primary'}
          value={taskNumberValue}
          onValueChange={value => {
            setTaskNumberValue(value);
          }}
        />
      );
    }
  }
}
