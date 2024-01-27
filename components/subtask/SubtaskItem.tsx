'use client';

import React, { KeyboardEvent, useMemo, useState, useTransition } from 'react';
import { Subtask } from '@prisma/client';

import { Checkbox, Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { CornerDownRight, MoreVertical } from 'lucide-react';

import { updateSubtask } from '@/lib/actions/subtask';
import { UpdateSubtask } from '@/lib/schemas/subtask';
import { z } from 'zod';

export enum InputType {
  // eslint-disable-next-line no-unused-vars
  remarks,
  // eslint-disable-next-line no-unused-vars
  issue,
  // eslint-disable-next-line no-unused-vars
  numberVal,
}

export default function SubtaskItem({ subtask }: { subtask: Subtask }) {
  let [isPending, startTransition] = useTransition();

  const [subtaskIsComplete, setSubtaskIsComplete] = useState(
    subtask.isComplete,
  );
  // eslint-disable-next-line no-unused-vars
  const [subtaskActivity, setSubtaskActivity] = useState(subtask.taskActivity);
  // eslint-disable-next-line no-unused-vars
  const [subtaskDescription, setSubtaskDescription] = useState(
    subtask.description,
  );
  // eslint-disable-next-line no-unused-vars
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

      let updateSubtask: z.infer<typeof UpdateSubtask> = {};
      switch (type) {
        case InputType.remarks:
          updateSubtask.remarks = subtaskRemarks;
          break;
        case InputType.issue:
          updateSubtask.issue = subtaskIssue;
          break;
        case InputType.numberVal:
          updateSubtask.taskNumberVal = parseInt(taskNumberValue, 10);
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
      const taskUpdate: z.infer<typeof UpdateSubtask> = {
        taskSelected: changedValue,
      };

      startTransition(() => {
        updateSubtask(subtask.id, taskUpdate).then(() => {
          if (!isPending) console.log('updated');
        });
      });
    }
  }

  function updateSubtaskClient(subtaskUpdate: z.infer<typeof UpdateSubtask>) {
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
        {taskType === 'CHECK' && (
          <div className="flex justify-center">
            <Checkbox
              isSelected={subtaskIsComplete}
              onValueChange={() => {
                setSubtaskIsComplete(!subtaskIsComplete);
                const updateSubtask: z.infer<typeof UpdateSubtask> = {
                  isComplete: !subtaskIsComplete,
                };
                updateSubtaskClient(updateSubtask);
              }}
            />
          </div>
        )}
        {taskType === 'CHOICE' && (
          <div className="flex justify-center">
            <Switch
              className="flex-1"
              isSelected={taskBool}
              onValueChange={() => {
                setTaskBool(!taskBool);
                const taskUpdate: z.infer<typeof UpdateSubtask> = {
                  taskBool: !taskBool,
                };
                updateSubtaskClient(taskUpdate);
              }}
            />
          </div>
        )}
        {(taskType === 'SINGLE_SELECT' || taskType === 'MULTIPLE_SELECT') && (
          <Select
            variant="faded"
            selectedKeys={taskSelected}
            selectionMode={
              taskType === 'MULTIPLE_SELECT' ? 'multiple' : 'single'
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
        {taskType === 'NUMBER' && (
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
