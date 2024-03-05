import React, { useState } from 'react';
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
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useTaskStore } from '@/hooks/use-task.store';
import { isNullOrEmpty } from '@/lib/function/string';
import { TaskItem } from '@/types/task';
import { Checkbox, Radio, RadioGroup } from '@nextui-org/react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ChecklistTaskDetailsProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChecklistTaskDetails({
  open,
  onClose,
}: ChecklistTaskDetailsProps) {
  const isDesktop = useMediaQuery('(min-width: 768px');

  const { currentTask } = useTaskStore();

  if (!currentTask) {
    return null;
  }

  function handleClose() {
    onClose();
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{currentTask.taskActivity}</SheetTitle>
          <SheetDescription>
            {isNullOrEmpty(currentTask.description) ?? 'No description'}
          </SheetDescription>
        </SheetHeader>
        <UpdateTaskValueFormComponent task={currentTask} />
        <SheetFooter>
          <Button>Update</Button>
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
          <UpdateTaskValueFormComponent task={currentTask} />
        </div>
        <DrawerFooter>
          <Button>Update</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function UpdateTaskValueFormComponent({ task }: { task: TaskItem }) {
  const [taskCheck, setTaskCheck] = useState(task.taskCheck ?? false);
  const [taskNumber, setTaskNumber] = useState(task.taskNumberVal ?? 0);
  const [taskSelectedSingle, setTaskSelectedSingle] = useState(
    task.taskSelected[0],
  );
  const [taskSelectedMultiple, setTaskSelectedMultiple] = useState(() => {
    return task.listChoice.map(choice => ({
      id: uuidv4(),
      selected: task.taskSelected.includes(choice),
      value: choice,
    }));
  });

  const listChoiceWithId = task.listChoice.map(choice => ({
    id: uuidv4(),
    value: choice,
  }));

  const selectedCount = taskSelectedMultiple.filter(
    item => item.selected,
  ).length;

  function handleCheckChange() {
    setTaskCheck(!taskCheck);
  }

  function handleTaskNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTaskNumber(Number(event.target.value));
  }

  function handleChoiceCheck(id: string) {
    setTaskSelectedMultiple(prevChoices => {
      return prevChoices.map(choice => {
        if (choice.id === id) {
          return {
            ...choice,
            selected: !choice.selected,
          };
        }

        return choice;
      });
    });
  }

  switch (task.taskType) {
    case 'CHECK':
      return (
        <Checkbox
          lineThrough
          isSelected={taskCheck}
          onValueChange={handleCheckChange}
        >
          {task.taskActivity}
        </Checkbox>
      );

    case 'CHOICE':
      return (
        <RadioGroup label="Select One" orientation="horizontal">
          <Radio value="1">Yes</Radio>
          <Radio value="0">No</Radio>
        </RadioGroup>
      );

    case 'NUMBER':
      return (
        <Input
          type="number"
          value={taskNumber}
          onChange={handleTaskNumberChange}
        />
      );

    case 'SINGLE_SELECT':
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {taskSelectedSingle ? taskSelectedSingle : 'Choose One'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={taskSelectedSingle}
              onValueChange={setTaskSelectedSingle}
            >
              {listChoiceWithId.map(choice => (
                <DropdownMenuRadioItem key={choice.id} value={choice.value}>
                  {choice.value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

    case 'MULTIPLE_SELECT':
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {selectedCount === 0 && 'Choose one or more'}
              {selectedCount === 1 && '1 option selected'}
              {selectedCount > 1 && `${selectedCount} options selected`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {taskSelectedMultiple.map(choice => (
              <DropdownMenuCheckboxItem
                key={choice.id}
                checked={choice.selected}
                onCheckedChange={() => handleChoiceCheck(choice.id)}
              >
                {choice.value}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuCheckboxItem></DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
  }
}
