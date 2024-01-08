'use client';

import React, { Fragment, useEffect, useState, useTransition } from 'react';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { TaskType, task } from '@prisma/client';
import { createTask } from '@/app/api/server-actions';
import moment from 'moment';
import { selectionChoices } from '@/utils/data/task-type-options';
import { LuTrash2 } from 'react-icons/lu';

export default function TaskAdd({ checklistUid }: { checklistUid: string }) {
  let [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const [taskActivity, setTaskActivity] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [haveSubtask, setHaveSubtask] = useState(false);
  const [selection, setSelection] = useState<TaskType>(TaskType.check);
  const [listCount, setListCount] = useState<number>(1);
  const [choices, setChoices] = useState(Array(listCount).fill('Choice 1'));
  type SubtaskOptions = {
    title: string;
    description: string;
    type: TaskType;
    listOptions?: string[];
  };
  const [subtaskList, setSubtaskList] = useState<SubtaskOptions[]>([]);

  function handleSelectionChange(val: any) {
    setSelection(val.currentKey as TaskType);
  }

  function handleDeleteChoice(indexToDelete: number) {
    setChoices(prevChoices => {
      const newChoices = [...prevChoices];
      newChoices.splice(indexToDelete, 1);
      return newChoices;
    });
    setListCount(prevCount => Math.max(prevCount - 1, 0));
  }

  function handleChoiceChange(index: number, value: string) {
    setChoices(prevChoices => {
      const newChoices = [...prevChoices];
      newChoices[index] = value;
      return newChoices;
    });
  }

  function handleAddChoice() {
    setListCount(prevCount => prevCount + 1);
    setChoices(prevChoices => [...prevChoices, '']);
  }

  function addTaskClient() {
    const taskAdd: task = {
      uid: `TK-${moment().format('YYMMDDHHmmssSSS')}`,
      checklist_uid: checklistUid,
      task_activity: taskActivity,
      description: taskDescription,
      task_type: TaskType[selection],
      list_choice: choices,
      task_bool: false,
      task_selected: [],
      is_complete: false,
      remarks: '',
      issue: '',
      deadline: null,
      completed_by: null,
      have_subtask: false,
      task_number_val: 0,
      task_check: false,
      task_order: 0,
    };

    startTransition(() => {
      createTask(taskAdd);
    });
  }

  function closeModal() {
    setOpen(prevOpen => !prevOpen);
    setSelection('check');
    setTaskActivity('');
    setTaskDescription('');
  }

  function handleAddSubtask() {
    const newSubtask: SubtaskOptions = {
      title: '',
      description: '',
      type: 'check',
    };

    setSubtaskList([...subtaskList, newSubtask]);
  }

  function handleSubtaskTitleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const updatedSubtaskList = [...subtaskList];
    updatedSubtaskList[index].title = e.target.value;
    setSubtaskList(updatedSubtaskList);
  }

  function handleSubtaskDescriptionChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const updatedSubtaskList = [...subtaskList];
    updatedSubtaskList[index].description = e.target.value;
    setSubtaskList(updatedSubtaskList);
  }

  function handleDeleteSubtask(index: number) {
    const updatedSubtaskList = [...subtaskList];
    updatedSubtaskList.splice(index, 1);
    setSubtaskList(updatedSubtaskList);
  }

  function handleSaveSubtask() {
    console.log(subtaskList);
  }

  useEffect(() => {
    if (!isPending) {
      closeModal();
    }
  }, [isPending]);

  return (
    <div>
      <Button onPress={() => setOpen(!open)}>Add Task</Button>
      <Modal isOpen={open} hideCloseButton backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add New Task
          </ModalHeader>
          <ModalBody>
            <Input
              isRequired
              autoFocus
              label="Activity"
              variant="faded"
              value={taskActivity}
              onValueChange={setTaskActivity}
            />
            <Input
              label="Description"
              variant="faded"
              value={taskDescription}
              onValueChange={setTaskDescription}
            />
            <Checkbox isSelected={haveSubtask} onValueChange={setHaveSubtask}>
              Multiple Task
            </Checkbox>
            {haveSubtask && (
              <Fragment>
                {subtaskList.map((subtask, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        label={`Subtask title ${index + 1}`}
                        value={subtask.title}
                        onChange={e => handleSubtaskTitleChange(e, index)}
                        variant="faded"
                      />
                      <Button
                        isIconOnly
                        onClick={() => handleDeleteSubtask(index)}
                        color="warning"
                      >
                        <LuTrash2 />
                      </Button>
                    </div>
                    <Input
                      label={`Subtask description ${index + 1}`}
                      value={subtask.description}
                      onChange={e => handleSubtaskDescriptionChange(e, index)}
                    />
                  </div>
                ))}
                <Button onClick={handleAddSubtask}>Add Subtask</Button>
                <Button onClick={handleSaveSubtask}>Save</Button>
              </Fragment>
            )}
            {!haveSubtask && (
              <Select
                isRequired
                label="Type (default check)"
                variant="faded"
                value={selection}
                onSelectionChange={handleSelectionChange}
              >
                {selectionChoices.map(choice => (
                  <SelectItem key={choice.key} value={choice.key}>
                    {choice.value}
                  </SelectItem>
                ))}
              </Select>
            )}
            {(selection === 'selectOne' || selection === 'selectMultiple') && (
              <Fragment>
                {choices.map((choice, index) => (
                  <div className="flex items-center" key={index}>
                    <Input
                      label={`List Choice ${index + 1}`}
                      variant="faded"
                      value={choice}
                      onChange={e => handleChoiceChange(index, e.target.value)}
                    />
                    <Button
                      className="ml-2"
                      isIconOnly
                      onClick={() => handleDeleteChoice(index)}
                    >
                      <LuTrash2 />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => handleAddChoice()}>Add Choice</Button>
              </Fragment>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={closeModal}>
              Close
            </Button>
            <Button
              isDisabled={
                taskActivity === '' ||
                (selection === 'selectOne' && listCount < 2) ||
                (selection === 'selectMultiple' && listCount < 2)
              }
              color="primary"
              onPress={() => {
                addTaskClient();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
