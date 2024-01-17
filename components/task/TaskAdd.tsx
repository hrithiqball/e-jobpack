'use client';

import React, { ChangeEvent, Fragment, useState, useTransition } from 'react';
import { TaskType, Checklist } from '@prisma/client';
import { useRouter } from 'next/navigation';

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
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { createTask } from '@/lib/actions/task';
import { selectionChoices } from '@/public/utils/task-type-options';
import { CreateTask } from '@/lib/schemas/task';

interface TaskAddProps {
  checklist: Checklist;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TaskAdd({ checklist, open, setOpen }: TaskAddProps) {
  let [isPending, startTransition] = useTransition();
  const router = useRouter();
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
    const validatedFields = CreateTask.safeParse({
      checklistId: checklist.id,
      taskActivity: taskActivity,
      description: taskDescription,
      deadline: new Date(),
      listChoice: choices,
    });

    if (!validatedFields.success) {
      toast.error(validatedFields.error.issues[0].message);
      return;
    }

    startTransition(() => {
      createTask({ ...validatedFields.data }, TaskType[selection]).then(res => {
        if (!isPending) console.log(res);
        toast.success('Task added successfully');
        setOpen(prevOpen => !prevOpen);
        router.refresh();
      });
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

  function handleSubtaskTitleChange(index: number) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSubtaskList = [...subtaskList];

      updatedSubtaskList[index].title = event.target.value;
      setSubtaskList(updatedSubtaskList);
    };
  }

  function handleSubtaskDescriptionChange(index: number) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const updatedSubtaskList = [...subtaskList];

      updatedSubtaskList[index].description = event.target.value;
      setSubtaskList(updatedSubtaskList);
    };
  }

  function handleDeleteSubtask(index: number) {
    const updatedSubtaskList = [...subtaskList];
    updatedSubtaskList.splice(index, 1);
    setSubtaskList(updatedSubtaskList);
  }

  function handleSaveSubtask() {
    console.log(subtaskList);
  }

  return (
    <Modal isOpen={open} hideCloseButton backdrop="blur">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Add New Task</ModalHeader>
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
                      onChange={handleSubtaskTitleChange(index)}
                      variant="faded"
                    />
                    <Button
                      isIconOnly
                      onClick={() => handleDeleteSubtask(index)}
                      color="warning"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <Input
                    label={`Subtask description ${index + 1}`}
                    value={subtask.description}
                    onChange={handleSubtaskDescriptionChange(index)}
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
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddChoice()}>Add Choice</Button>
            </Fragment>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="faded" onPress={closeModal}>
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
  );
}