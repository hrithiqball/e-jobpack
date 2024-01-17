'use client';

import React, { Key, useEffect, useMemo, useState, useTransition } from 'react';

import { Task } from '@prisma/client';
import { z } from 'zod';

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from '@nextui-org/react';
import {
  ClipboardX,
  MessageCircleWarning,
  MoreVertical,
  PencilLine,
} from 'lucide-react';
import { toast } from 'sonner';

import { deleteTask, updateTask } from '@/lib/actions/task';
import { UpdateTask } from '@/lib/schemas/task';
import { useCurrentUser } from '@/hooks/use-current-user';

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  let [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  const [taskActivity, setTaskActivity] = useState(task.taskActivity);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskType, setTaskType] = useState(task.taskType);
  const [taskSelected, setTaskSelected] = useState<string[]>(task.taskSelected);
  const [taskBool, setTaskBool] = useState(task.taskBool ?? false);
  const [taskRemark, setTaskRemark] = useState(task.remarks ?? '');
  const [taskIsComplete, setTaskIsComplete] = useState(task.isComplete);
  const [taskIssue, setTaskIssue] = useState(task.issue ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    task.taskNumberVal?.toString() ?? '',
  );
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  const numericRegex = /^-?\d+(\.\d+)?$/;

  function updateMedia() {
    setDesktop(window.innerWidth > 650);
  }

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const validateNumericInput = (value: string) => value.match(numericRegex);

  const isInvalid = useMemo(() => {
    if (taskNumberValue === '') return false;

    return validateNumericInput(taskNumberValue) ? false : true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskNumberValue]);

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
        toast.error(validatedFields.error.issues[0].message);
        return;
      }

      if (user === undefined) {
        toast.error('Session expired');
        return;
      }

      startTransition(() => {
        updateTask(task.id, user.id, { ...validatedFields.data }).then(() => {
          if (!isPending) toast.success('Task updated successfully');
        });
      });
    }
  }

  function updateTaskClient(taskUpdate: z.infer<typeof UpdateTask>) {
    if (user === undefined) {
      toast.error('Session expired');
      return;
    }

    startTransition(() => {
      updateTask(task.id, user.id, taskUpdate).then(() => {
        toast.success('Task updated successfully');
      });
    });
  }

  function handleActions(key: Key) {
    if (key === 'edit') toast.info('editing');
    else {
      startTransition(() => {
        deleteTask(task.id)
          .then(() => toast.success('Task deleted'))
          .catch(() => toast.error('Task not deleted'));
      });
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <div className="flex flex-col">
          <span className="text-sm font-light">{taskActivity}</span>
          <span className="text-sm font-light">{taskDescription}</span>
        </div>
      </div>
      <div className="flex-1 px-4">
        {taskType === 'check' && (
          <div className="flex justify-center">
            <Checkbox
              aria-label="Task Checkbox"
              isSelected={taskIsComplete}
              onValueChange={() => {
                setTaskIsComplete(!taskIsComplete);
                const updateTask: z.infer<typeof UpdateTask> = {
                  isComplete: !taskIsComplete,
                };
                updateTaskClient(updateTask);
              }}
            />
          </div>
        )}
        {taskType === 'choice' && (
          <div className="flex justify-center">
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
                updateTaskClient(taskUpdate);
              }}
            />
          </div>
        )}
        {(taskType === 'selectOne' ||
          taskType === 'selectMultiple' ||
          taskType === 'MULTIPLE_SELECT' ||
          taskType === 'SINGLE_SELECT') && (
          <Select
            aria-label="Task Select"
            variant="faded"
            selectedKeys={taskSelected}
            selectionMode={
              taskType === 'selectMultiple' ? 'multiple' : 'single'
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
        )}
        {taskType === 'number' && (
          <Input
            aria-label="Task Number"
            variant="faded"
            value={taskNumberValue}
            onValueChange={setTaskNumberValue}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
          />
        )}
      </div>
      {isDesktop && (
        <>
          <div className="flex-1 px-4">
            <Textarea
              aria-label="Task Issue"
              variant="faded"
              maxRows={1}
              size="sm"
              value={taskIssue}
              onValueChange={setTaskIssue}
            />
          </div>
          <div className="flex-1 px-4">
            <Textarea
              aria-label="Task Remark"
              variant="faded"
              maxRows={1}
              size="sm"
              value={taskRemark}
              onValueChange={setTaskRemark}
            />
          </div>
        </>
      )}
      <div className="flex-2">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="faded" size="sm" isIconOnly>
              <MoreVertical size={18} />
            </Button>
          </DropdownTrigger>
          {isDesktop ? (
            <DropdownMenu
              aria-label="Action event example"
              onAction={handleActions}
            >
              <DropdownItem
                key="edit"
                variant="faded"
                startContent={<PencilLine size={18} />}
              >
                Edit Task
              </DropdownItem>
              <DropdownItem
                key="delete"
                variant="faded"
                className="text-danger"
                color="danger"
                startContent={<ClipboardX size={18} />}
              >
                Delete Task
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownItem
                variant="faded"
                key="add-remarks"
                startContent={<MessageCircleWarning size={18} />}
              >
                Add Remarks
              </DropdownItem>
              <DropdownItem
                key="edit"
                variant="faded"
                startContent={<PencilLine size={18} />}
              >
                Edit Task
              </DropdownItem>
              <DropdownItem
                key="delete"
                variant="faded"
                className="text-danger"
                color="danger"
                startContent={<ClipboardX size={18} />}
              >
                Delete Task
              </DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
