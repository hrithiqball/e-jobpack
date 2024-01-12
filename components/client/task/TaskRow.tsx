'use client';

import React, { Key, useEffect, useMemo, useState, useTransition } from 'react';
import { Task } from '@prisma/client';
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
import { UpdateTask } from '@/app/api/task/[id]/route';
import { toast } from 'sonner';
import {
  ClipboardX,
  MessageCircleWarning,
  MoreVertical,
  PencilLine,
} from 'lucide-react';
import { deleteTask, updateTask } from '@/lib/actions/task';

export default function TaskRow({ task }: { task: Task }) {
  let [isPending, startTransition] = useTransition();
  const [taskActivity, setTaskActivity] = useState(task.task_activity);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskType, setTaskType] = useState(task.task_type);
  const [taskSelected, setTaskSelected] = useState<string[]>(
    task.task_selected,
  );
  const [taskBool, setTaskBool] = useState(task.task_bool ?? false);
  const [taskRemark, setTaskRemark] = useState(task.remarks ?? '');
  const [taskIsComplete, setTaskIsComplete] = useState(task.is_complete);
  const [taskIssue, setTaskIssue] = useState(task.issue ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    task.task_number_val?.toString() ?? '',
  );
  const numericRegex = /^-?\d+(\.\d+)?$/;

  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

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
      const taskUpdate: UpdateTask = {
        task_selected: changedValue,
      };

      startTransition(() => {
        updateTask(task.uid, taskUpdate).then(() => {
          if (!isPending) toast.success('Task updated successfully');
        });
      });
    }
  }

  function updateTaskClient(taskUpdate: UpdateTask) {
    startTransition(() => {
      updateTask(task.uid, taskUpdate).then(() => {
        toast.success('Task updated successfully');
      });
    });
  }

  function handleActions(key: Key) {
    if (key === 'edit') toast.info('editing');
    else {
      startTransition(() => {
        deleteTask(task.uid)
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
                const updateTask: UpdateTask = {
                  is_complete: !taskIsComplete,
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
                const taskUpdate: UpdateTask = {
                  task_bool: !taskBool,
                };
                updateTaskClient(taskUpdate);
              }}
            />
          </div>
        )}
        {(taskType === 'selectOne' || taskType === 'selectMultiple') && (
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
            {task.list_choice.map(choice => (
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
              <DropdownItem key="edit" startContent={<PencilLine size={18} />}>
                Edit Task
              </DropdownItem>
              <DropdownItem
                key="delete"
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
                key="add-remarks"
                startContent={<MessageCircleWarning size={18} />}
              >
                Add Remarks
              </DropdownItem>
              <DropdownItem key="edit" startContent={<PencilLine size={18} />}>
                Edit Task
              </DropdownItem>
              <DropdownItem
                key="delete"
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
