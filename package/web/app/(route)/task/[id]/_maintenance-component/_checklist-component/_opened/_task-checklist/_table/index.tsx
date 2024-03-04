'use client';

import { Fragment, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

import {
  Edit,
  FileQuestion,
  FileWarning,
  Library,
  ListTree,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { TaskList, TaskItem } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTaskStore } from '@/hooks/use-task.store';
import { createTaskLibrary } from '@/lib/actions/task-library';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import { isNullOrEmpty } from '@/lib/function/string';
import { deleteTask } from '@/lib/actions/task';

// import TaskValue from './value';
import TaskIssue from './issue';
import TaskRemark from './remarks';
import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import EditTask from '@/components/edit-task';
import TableTaskCompleteCell from '@/app/(route)/maintenance/_component/_maintenance-tab/_details/task-complete-cell';
import ChecklistTaskDetails from './task-details';
import { stopPropagation } from '@/lib/function/stopPropagation';

type TaskTableProps = {
  taskList: TaskList;
};

export default function TaskTable({ taskList }: TaskTableProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px');
  const user = useCurrentUser();
  const router = useRouter();

  const { setCurrentTask } = useTaskStore();

  const [openEditTask, setOpenEditTask] = useState(false);
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    issue: false,
    remarks: false,
  });

  useEffect(() => {
    setColumnVisibility({
      issue: isDesktop,
      remarks: isDesktop,
    });
  }, [isDesktop]);

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: 'taskActivity',
      header: 'Task',
      cell: ({ row }) => {
        const description = row.original.description;

        return (
          <div className="flex items-center space-x-4">
            <TaskTypeHelper size={18} taskType={row.original.taskType} />
            <div className="flex flex-col">
              <p>{row.original.taskActivity}</p>
              <p className="text-xs text-gray-400">
                {isNullOrEmpty(description) ? description : 'No description'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'taskType',
      header: () => null,
      cell: ({ row }) => {
        return (
          <div>
            <TableTaskCompleteCell task={row.original} />
          </div>
        );
      },
    },
    {
      accessorKey: 'issue',
      header: 'Issue',
      cell: ({ row }) => {
        return (
          <div onClick={stopPropagation}>
            <TaskIssue task={row.original} />
          </div>
        );
      },
    },
    {
      accessorKey: 'remarks',
      header: 'Remark',
      cell: ({ row }) => {
        return (
          <div onClick={stopPropagation}>
            <TaskRemark task={row.original} />
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        function handleEdit() {
          setCurrentTask(row.original);
          setOpenEditTask(true);
        }

        function handleAddSubtask() {
          console.log(row.original);
        }

        function handleSaveAsLibrary() {
          startTransition(() => {
            if (user === undefined || user.id === undefined) {
              toast.error('User session expired');
              return;
            }

            const newTaskLibrary: CreateTaskLibrary = {
              id: uuidv4(),
              taskActivity: row.original.taskActivity,
              description: row.original.description,
              taskType: row.original.taskType,
              listChoice: row.original.listChoice,
              checklistLibraryId: null,
            };

            toast.promise(createTaskLibrary(user.id, newTaskLibrary), {
              loading: 'Exporting task...',
              success: () => {
                router.refresh();
                return 'Task exported successfully';
              },
              error: 'Failed to export task',
            });
          });
        }

        function handleRemoveTask() {
          startTransition(() => {
            if (user === undefined || user.id === undefined) {
              toast.error('User session expired');
              return;
            }

            toast.promise(deleteTask(user.id, row.original.id), {
              loading: 'Removing task...',
              success: () => {
                router.refresh();
                return 'Task removed successfully';
              },
              error: 'Failed to remove task 🥲',
            });
          });
        }

        function handleAddIssue() {
          console.log(row.original);
        }

        function handleAddRemarks() {
          console.log(row.original);
        }

        return (
          <div className="text-right">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={transitioning}
                  onClick={e => e.stopPropagation()}
                >
                  <MoreVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 rounded-xl p-2">
                <PopoverItem
                  onClick={handleEdit}
                  startContent={<Edit size={18} />}
                >
                  Edit
                </PopoverItem>
                <PopoverItem
                  onClick={handleAddSubtask}
                  startContent={<ListTree size={18} />}
                >
                  Add Subtask
                </PopoverItem>
                <PopoverItem
                  onClick={handleSaveAsLibrary}
                  startContent={<Library size={18} />}
                >
                  Save as Library
                </PopoverItem>
                {!isDesktop && (
                  <Fragment>
                    <PopoverItem
                      onClick={handleAddIssue}
                      startContent={<FileWarning size={18} />}
                    >
                      Add Issue
                    </PopoverItem>
                    <PopoverItem
                      onClick={handleAddRemarks}
                      startContent={<FileQuestion size={18} />}
                    >
                      Add Remarks
                    </PopoverItem>
                  </Fragment>
                )}
                <PopoverItemDestructive
                  onClick={handleRemoveTask}
                  startContent={<Trash2 size={18} />}
                >
                  Remove Task
                </PopoverItemDestructive>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: taskList,
    columns,
    getCoreRowModel: getCoreRowModel<TaskItem>(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  function handleCloseEditTask() {
    setOpenEditTask(false);
  }

  function handleOpenTaskDetails(task: TaskItem) {
    setCurrentTask(task);
    setOpenTaskDetails(true);
  }

  function handleCloseTaskDetails() {
    setOpenTaskDetails(false);
  }

  return (
    <div>
      {taskList.length > 0 ? (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} noHover>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                noHover
                onClick={() => handleOpenTaskDetails(row.original)}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center">
          <span className="text-gray-400">No task found</span>
        </div>
      )}
      <EditTask open={openEditTask} onClose={handleCloseEditTask} />
      <ChecklistTaskDetails
        open={openTaskDetails}
        onClose={handleCloseTaskDetails}
      />
    </div>
  );
}
