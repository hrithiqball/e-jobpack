/* eslint-disable no-undef */
'use client';

import { Fragment, Key, useEffect, useRef, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/tableT';
import { Check, MoreVertical, X } from 'lucide-react';

import { TaskList, TaskItem } from '@/types/task';
import TaskValue from './TaskValue';
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';

type TaskTableProps = {
  taskList: TaskList;
};

export default function TaskTable({ taskList }: TaskTableProps) {
  const typeIssueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typeRemarkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [issueValues, setIssueValues] = useState<{ [key: string]: string }>({});
  const [remarkValues, setRemarkValues] = useState<{ [key: string]: string }>(
    {},
  );
  const [tempTask, setTempTask] = useState<{
    taskActivity: string | null;
    description: string | null;
  }>({ taskActivity: '', description: '' });

  useEffect(() => {
    const newIssueValues = taskList.reduce(
      (acc, task) => {
        acc[task.id] = task.issue || '';
        return acc;
      },
      {} as { [key: string]: string },
    );

    setIssueValues(newIssueValues);
  }, [taskList]);

  useEffect(() => {
    const newRemarkValues = taskList.reduce(
      (acc, task) => {
        acc[task.id] = task.remarks || '';
        return acc;
      },
      {} as { [key: string]: string },
    );

    setRemarkValues(newRemarkValues);
  }, [taskList]);

  function handleAction(task: TaskItem) {
    return (key: Key) => {
      switch (key) {
        case 'edit-task':
          setTempTask({
            taskActivity: task.taskActivity,
            description: task.description,
          });
          setEditingTaskId(task.id);
          break;

        case 'remove-task':
          break;

        case 'add-subtask':
          break;
      }
    };
  }

  function handleIssueChange(id: string, value: string) {
    setIssueValues(prev => ({
      ...prev,
      [id]: value,
    }));

    if (typeIssueTimeoutRef.current) {
      clearTimeout(typeIssueTimeoutRef.current);
    }

    typeIssueTimeoutRef.current = setTimeout(() => {
      handleTaskUpdate(id, value);
    }, 2000);
  }

  function handleRemarkChange(id: string, value: string) {
    setRemarkValues(prev => ({
      ...prev,
      [id]: value,
    }));

    if (typeRemarkTimeoutRef.current) {
      clearTimeout(typeRemarkTimeoutRef.current);
    }

    typeRemarkTimeoutRef.current = setTimeout(() => {
      handleTaskUpdate(id, value);
    }, 2000);
  }

  function handleTaskUpdate(id: string, value: string) {
    console.log(id, value);
  }

  function handleCancelEditTask() {
    setEditingTaskId(null);
  }

  function handleSaveEditTask() {
    setEditingTaskId(null);
  }

  function handleTaskActivityChange(taskActivity: string) {
    setTempTask(prev => {
      return {
        ...prev,
        taskActivity,
      };
    });
  }

  return taskList.length > 0 ? (
    <Table>
      <TableHeader>
        <TableHead className="text-center">Task</TableHead>
        <TableHead></TableHead>
        <TableHead>Issue</TableHead>
        <TableHead>Remark</TableHead>
        <TableHead></TableHead>
      </TableHeader>
      <TableBody>
        {taskList.map(task => (
          <Fragment key={task.id}>
            <TableRow>
              <TableCell>
                {editingTaskId === task.id ? (
                  <Input
                    variant="faded"
                    size="sm"
                    color="primary"
                    value={tempTask?.taskActivity ?? ''}
                    onValueChange={handleTaskActivityChange}
                    className="max-w-[300px]"
                  />
                ) : (
                  <span>{task.taskActivity}</span>
                )}
              </TableCell>
              <TableCell align="center" className="min-w-[500px]">
                {editingTaskId === task.id ? (
                  // TODO: use TaskValueEdit component instead
                  <Popover placement="bottom" showArrow offset={10}>
                    <PopoverTrigger>
                      <Button variant="faded" size="sm" color="primary">
                        {task.taskType
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/(?:^|\s)\S/g, function (char) {
                            return char.toUpperCase();
                          })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px]">
                      {titleProps => (
                        <div className="px-1 py-2 w-full">
                          <p
                            className="text-small font-bold text-foreground"
                            {...titleProps}
                          >
                            Value Type
                          </p>
                          <div className="mt-2 flex flex-col gap-2 w-full">
                            <Input
                              defaultValue="100%"
                              label="Width"
                              size="sm"
                              variant="bordered"
                            />
                            <Input
                              defaultValue="300px"
                              label="Max. width"
                              size="sm"
                              variant="bordered"
                            />
                            <Input
                              defaultValue="24px"
                              label="Height"
                              size="sm"
                              variant="bordered"
                            />
                            <Input
                              defaultValue="30px"
                              label="Max. height"
                              size="sm"
                              variant="bordered"
                            />
                          </div>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <TaskValue task={task} />
                )}
              </TableCell>
              <TableCell>
                <Input
                  size="sm"
                  variant="faded"
                  color="primary"
                  value={issueValues[task.id] || ''}
                  onValueChange={value => handleIssueChange(task.id, value)}
                  className="max-w-[300px]"
                />
              </TableCell>
              <TableCell>
                <Input
                  size="sm"
                  variant="faded"
                  color="primary"
                  value={remarkValues[task.id] || ''}
                  onValueChange={value => handleRemarkChange(task.id, value)}
                  className="max-w-[300px]"
                />
              </TableCell>
              <TableCell align="right">
                {editingTaskId === task.id ? (
                  <ButtonGroup>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="success"
                      onClick={handleCancelEditTask}
                    >
                      <Check size={18} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={handleSaveEditTask}
                    >
                      <X size={18} />
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Task action"
                      color="primary"
                      onAction={handleAction(task)}
                    >
                      <DropdownItem key="edit-task">Edit</DropdownItem>
                      <DropdownItem key="add-subtask">Add subtask</DropdownItem>
                      <DropdownItem key="remove-task">Remove</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </TableCell>
            </TableRow>
            {task.subtask.length > 0 &&
              task.subtask.map(subtask => (
                <TableRow key={subtask.id}>
                  <TableCell>{subtask.taskActivity}</TableCell>
                  <TableCell>{subtask.taskActivity}</TableCell>
                  <TableCell>{subtask.taskActivity}</TableCell>
                  <TableCell>{subtask.taskActivity}</TableCell>
                </TableRow>
              ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="flex justify-center items-center">
      <span className="text-gray-400">No task found</span>
    </div>
  );
}
