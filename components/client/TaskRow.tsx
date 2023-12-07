'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { task } from '@prisma/client';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from '@nextui-org/react';
import { updateTask } from '@/utils/actions/route';
import { UpdateTask } from '@/app/api/task/[uid]/route';
import { LuPen, LuTrash2 } from 'react-icons/lu';
import { isEditState, useSelector } from '@/lib/redux';

export default function TaskRow({ task }: { task: task }) {
  const isEdit = useSelector(isEditState);
  let [isPending, startTransition] = useTransition();
  const [taskActivity, setTaskActivity] = useState(task.task_activity);
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
        updateTask(task.uid, taskUpdate);
      });
    }
    console.log(val.currentKey as string);
  }

  function updateTaskClient(taskUpdate: UpdateTask) {
    startTransition(() => {
      updateTask(task.uid, taskUpdate);
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <span>{taskActivity}</span>
      </div>
      <div className="flex-1 px-4">
        {taskType === 'check' && (
          <Checkbox
            isSelected={taskIsComplete}
            onValueChange={() => {
              setTaskIsComplete(!taskIsComplete);
              const updateTask: UpdateTask = {
                is_complete: !taskIsComplete,
              };
              updateTaskClient(updateTask);
            }}
          >
            {taskActivity} {isEdit ? 'true' : 'false'}
          </Checkbox>
        )}
        {taskType === 'choice' && (
          <Switch
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
        )}
        {(taskType === 'selectOne' || taskType === 'selectMultiple') && (
          <Select
            variant="bordered"
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
            variant="bordered"
            value={taskNumberValue}
            onValueChange={setTaskNumberValue}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
          />
        )}
      </div>
      <div className="flex-1 px-4">
        <Textarea
          variant="faded"
          maxRows={1}
          value={taskIssue}
          onValueChange={setTaskIssue}
        />
      </div>
      <div className="flex-1 px-4">
        <Textarea
          variant="bordered"
          maxRows={1}
          value={taskRemark}
          onValueChange={setTaskRemark}
        />
      </div>
      <div className="flex-2 space-x-2">
        <Button isIconOnly color="warning">
          <LuPen />
        </Button>
        <Button isIconOnly color="danger">
          <LuTrash2 />
        </Button>
      </div>
    </div>
  );
}
