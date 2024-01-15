'use client';

import React, { KeyboardEvent, useMemo, useState, useTransition } from 'react';
import { Subtask } from '@prisma/client';

import { Checkbox, Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { CornerDownRight, MoreVertical } from 'lucide-react';

import { updateSubtask } from '@/lib/actions/subtask';
import { UpdateSubtask } from '@/app/api/subtask/[id]/route';

export enum InputType {
  remarks,
  issue,
  numberVal,
}

export default function SubtaskItem({ subtask }: { subtask: Subtask }) {
  let [isPending, startTransition] = useTransition();
  const [subtaskIsComplete, setSubtaskIsComplete] = useState(
    subtask.isComplete,
  );
  const [subtaskActivity, setSubtaskActivity] = useState(subtask.taskActivity);
  const [subtaskDescription, setSubtaskDescription] = useState(
    subtask.description,
  );
  const [taskType, setTaskType] = useState(subtask.taskType);
  const [taskSelected, setTaskSelected] = useState<string[]>(
    subtask.taskSelected,
  );
  const [taskBool, setTaskBool] = useState(subtask.taskBool ?? false);
  const [subtaskIssue, setSubtaskIssue] = useState(subtask.issue ?? '');
  const [subtaskRemarks, setSubtaskRemarks] = useState(subtask.remarks ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    subtask.taskNumberVal?.toString() ?? '',
  );

  const numericRegex = /^-?\d+(\.\d+)?$/;

  function handleEnter(type: InputType) {
    return (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') return;

      let updateSubtask: UpdateSubtask = {};
      switch (type) {
        case InputType.remarks:
          updateSubtask.remarks = subtaskRemarks;
          break;
        case InputType.issue:
          updateSubtask.issue = subtaskIssue;
          break;
        case InputType.numberVal:
          updateSubtask.task_number_val = parseInt(taskNumberValue, 10);
          break;
      }

      updateSubtaskClient(updateSubtask);
    };
  }

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
      const taskUpdate: UpdateSubtask = {
        task_selected: changedValue,
      };

      startTransition(() => {
        updateSubtask(subtask.id, taskUpdate);
      });
    }
  }

  function updateSubtaskClient(subtaskUpdate: UpdateSubtask) {
    startTransition(() => {
      updateSubtask(subtask.id, subtaskUpdate);
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <CornerDownRight />
            <span className="text-medium font-medium ml-2">
              {subtaskActivity}
            </span>
          </div>
          <span className="text-sm font-thin">{subtaskDescription}</span>
        </div>
      </div>
      <div className="flex-1 px-4">
        {taskType === 'check' && (
          <div className="flex justify-center">
            <Checkbox
              isSelected={subtaskIsComplete}
              onValueChange={() => {
                setSubtaskIsComplete(!subtaskIsComplete);
                const updateSubtask: UpdateSubtask = {
                  is_complete: !subtaskIsComplete,
                };
                updateSubtaskClient(updateSubtask);
              }}
            />
          </div>
        )}
        {taskType === 'choice' && (
          <div className="flex justify-center">
            <Switch
              className="flex-1"
              isSelected={taskBool}
              onValueChange={() => {
                setTaskBool(!taskBool);
                const taskUpdate: UpdateSubtask = {
                  task_bool: !taskBool,
                };
                updateSubtaskClient(taskUpdate);
              }}
            />
          </div>
        )}
        {(taskType === 'selectOne' || taskType === 'selectMultiple') && (
          <Select
            variant="faded"
            selectedKeys={taskSelected}
            selectionMode={
              taskType === 'selectMultiple' ? 'multiple' : 'single'
            }
            onSelectionChange={handleSelectionChange}
            size="sm"
            placeholder="Choose one"
          >
            {subtask.listChoice.map(choice => (
              <SelectItem key={choice} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </Select>
        )}
        {taskType === 'number' && (
          <Input
            variant="faded"
            value={taskNumberValue}
            onValueChange={setTaskNumberValue}
            onKeyDown={handleEnter(InputType.numberVal)}
            isInvalid={isInvalid}
            color={isInvalid ? 'danger' : 'primary'}
          />
        )}
      </div>
      <div className="flex-1 px-4">
        <Input
          variant="faded"
          value={subtaskIssue}
          onValueChange={setSubtaskIssue}
          onKeyDown={handleEnter(InputType.issue)}
        />
      </div>
      <div className="flex-1 px-4">
        <Input
          variant="faded"
          value={subtaskRemarks}
          onValueChange={setSubtaskRemarks}
          onKeyDown={handleEnter(InputType.remarks)}
        />
      </div>
      <div className="flex-2 hover:cursor-not-allowed">
        <MoreVertical />
      </div>
    </div>
  );
}
