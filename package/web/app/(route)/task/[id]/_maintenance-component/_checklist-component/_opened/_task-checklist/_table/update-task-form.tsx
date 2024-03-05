import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox, Radio, RadioGroup } from '@nextui-org/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { TaskItem } from '@/types/task';

type UpdateTaskFormProps = {
  task: TaskItem;
  taskState: {
    taskCheck: boolean;
    taskNumber: number;
    taskBool: boolean | undefined;
    taskSelectedSingle: string | undefined;
    taskSelectedMultiple:
      | { id: string; selected: boolean; value: string }[]
      | undefined;
  };
  listChoice: { id: string; value: string }[];
  handleCheckChange: () => void;
  handleTaskNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChoiceCheck: (id: string) => void;
  setTaskSelectedSingle: (value: string) => void;
  handleChoiceChange: (value: string) => void;
};

export default function UpdateTaskForm({
  task,
  taskState,
  listChoice,
  handleCheckChange,
  handleTaskNumberChange,
  handleChoiceCheck,
  setTaskSelectedSingle,
  handleChoiceChange,
}: UpdateTaskFormProps) {
  const selectedCount = taskState.taskSelectedMultiple?.filter(
    item => item.selected,
  ).length;

  switch (task.taskType) {
    case 'CHECK':
      return (
        <Checkbox
          lineThrough
          isSelected={taskState.taskCheck}
          onValueChange={handleCheckChange}
        >
          {task.taskActivity}
        </Checkbox>
      );

    case 'CHOICE':
      return (
        <RadioGroup
          value={
            taskState.taskBool === true
              ? '1'
              : taskState.taskBool === false
                ? '0'
                : undefined
          }
          onValueChange={handleChoiceChange}
          label={task.taskActivity}
          orientation="horizontal"
        >
          <Radio value="1">Yes</Radio>
          <Radio value="0">No</Radio>
        </RadioGroup>
      );

    case 'NUMBER':
      return (
        <div className="flex flex-col space-y-3">
          <Label htmlFor="taskNumber">{task.taskActivity}</Label>
          <Input
            id="taskNumber"
            type="number"
            value={taskState.taskNumber}
            onChange={handleTaskNumberChange}
          />
        </div>
      );

    case 'SINGLE_SELECT':
      return (
        <div className="flex flex-col space-y-3">
          <Label>{task.taskActivity}</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {taskState.taskSelectedSingle || 'Choose One'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={taskState.taskSelectedSingle}
                onValueChange={setTaskSelectedSingle}
              >
                {listChoice.map(choice => (
                  <DropdownMenuRadioItem key={choice.id} value={choice.value}>
                    {choice.value}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );

    case 'MULTIPLE_SELECT':
      return (
        <div className="flex flex-col space-y-3">
          <Label>{task.taskActivity}</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {selectedCount === 0 && 'Choose one or more'}
                {selectedCount === 1 && '1 option selected'}
                {selectedCount && selectedCount > 1
                  ? `${selectedCount} options selected`
                  : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {taskState.taskSelectedMultiple?.map(choice => (
                <DropdownMenuCheckboxItem
                  key={choice.id}
                  checked={choice.selected}
                  onCheckedChange={() => handleChoiceCheck(choice.id)}
                >
                  {choice.value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
  }
}
