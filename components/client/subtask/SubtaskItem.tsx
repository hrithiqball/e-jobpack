'use client';

import React, { KeyboardEvent, useMemo, useState, useTransition } from 'react';
import { subtask } from '@prisma/client';
import { updateSubtask } from '@/app/api/server-actions';
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';
import { LuCornerDownRight, LuMoreVertical, LuTrash2 } from 'react-icons/lu';
import { isEditState, useSelector } from '@/lib/redux';

export enum InputType {
  remarks,
  issue,
  numberVal,
}

export default function SubtaskItem({ subtask }: { subtask: subtask }) {
  const isEdit = useSelector(isEditState);
  let [isPending, startTransition] = useTransition();
  const [subtaskIsComplete, setSubtaskIsComplete] = useState(
    subtask.is_complete,
  );
  const [subtaskActivity, setSubtaskActivity] = useState(subtask.task_activity);
  const [subtaskDescription, setSubtaskDescription] = useState(
    subtask.description,
  );
  const [taskType, setTaskType] = useState(subtask.task_type);
  const [taskSelected, setTaskSelected] = useState<string[]>(
    subtask.task_selected,
  );
  const [taskBool, setTaskBool] = useState(subtask.task_bool ?? false);
  const [subtaskIssue, setSubtaskIssue] = useState(subtask.issue ?? '');
  const [subtaskRemarks, setSubtaskRemarks] = useState(subtask.remarks ?? '');
  const [taskNumberValue, setTaskNumberValue] = useState<string>(
    subtask.task_number_val?.toString() ?? '',
  );

  const numericRegex = /^-?\d+(\.\d+)?$/;

  function handleEnter(
    event: KeyboardEvent<HTMLInputElement>,
    type: InputType,
  ) {
    if (event.key !== 'Enter') return;
    let updateSubtask: UpdateSubtask = {};
    if (type === InputType.remarks) updateSubtask.remarks = subtaskRemarks;
    if (type === InputType.issue) updateSubtask.issue = subtaskIssue;
    if (type === InputType.numberVal)
      updateSubtask.task_number_val = parseInt(taskNumberValue, 10);

    updateSubtaskClient(updateSubtask);
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
        updateSubtask(subtask.uid, taskUpdate);
      });
    }
  }

  function updateSubtaskClient(subtaskUpdate: UpdateSubtask) {
    startTransition(() => {
      updateSubtask(subtask.uid, subtaskUpdate);
    });
  }

  return (
    <div className="flex items-center">
      <div className="flex-1 px-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <LuCornerDownRight />
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
            {subtask.list_choice.map(choice => (
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
            onKeyDown={e => handleEnter(e, InputType.numberVal)}
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
          onKeyDown={e => handleEnter(e, InputType.issue)}
        />
      </div>
      <div className="flex-1 px-4">
        <Input
          variant="faded"
          value={subtaskRemarks}
          onValueChange={setSubtaskRemarks}
          onKeyDown={e => handleEnter(e, InputType.remarks)}
        />
      </div>
      <div className="flex-2 hover:cursor-not-allowed">
        <LuMoreVertical />
        {/* <Button isDisabled={!isEdit} isIconOnly color="danger">
          <LuTrash2 />
        </Button> */}
      </div>
    </div>
  );
}
