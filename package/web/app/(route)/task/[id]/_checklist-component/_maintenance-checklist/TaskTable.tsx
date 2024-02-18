'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { ButtonGroup, Button } from '@nextui-org/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { TaskList, TaskItem } from '@/types/task';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useTaskStore } from '@/hooks/use-task.store';
import { createTaskLibrary } from '@/lib/actions/task-library';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import { deleteTask } from '@/lib/actions/task';

import TaskValue from './TaskValue';
import TaskActions from './TaskActions';
import { Check, X } from 'lucide-react';
import TaskIssue from './TaskIssue';
import TaskRemark from './TaskRemark';

type RowData = { row: Row<TaskItem> };

type TaskTableProps = {
  taskList: TaskList;
};

export default function TaskTable({ taskList }: TaskTableProps) {
  const { taskId, tmpTask, setTaskId } = useTaskStore();

  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px');
  const user = useCurrentUser();
  const router = useRouter();

  const columns: ColumnDef<TaskItem>[] = [
    {
      accessorKey: 'taskActivity',
      header: 'Task',
      cell: ({ row }: RowData) => {
        return <span>{row.getValue('taskActivity')}</span>;
      },
    },
    {
      accessorKey: 'taskType',
      header: () => null,
      cell: ({ row }: RowData) => {
        return (
          <div className="min-w-20 text-center">
            <TaskValue task={row.original} />
          </div>
        );
      },
    },
    isDesktop && {
      accessorKey: 'issue',
      header: 'Issue',
      cell: ({ row }: RowData) => {
        return (
          <TaskIssue taskId={row.original.id} issue={row.original.issue} />
        );
      },
    },
    isDesktop && {
      accessorKey: 'remarks',
      header: 'Remark',
      cell: ({ row }: RowData) => {
        return (
          <TaskRemark taskId={row.original.id} remarks={row.original.remarks} />
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }: RowData) => {
        return taskId === row.original.id ? (
          <div className="text-right">
            <ButtonGroup>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="success"
                onClick={handleSaveEditTask}
              >
                <Check size={18} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={handleCancelEditTask}
              >
                <X size={18} />
              </Button>
            </ButtonGroup>
          </div>
        ) : (
          <div className="text-right">
            <TaskActions
              transitioning={transitioning}
              task={row.original}
              handleRemoveTask={() => handleRemoveTask(row.original.id)}
              handleExportTask={() => handleExportTask(row.original)}
            />
          </div>
        );
      },
    },
  ].filter(Boolean);

  const table = useReactTable({
    data: taskList,
    columns,
    getCoreRowModel: getCoreRowModel<TaskItem>(),
  });

  function handleRemoveTask(taskId: string) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session expired');
        return;
      }

      toast.promise(deleteTask(user.id, taskId), {
        loading: 'Removing task...',
        success: () => {
          router.refresh();
          return 'Task removed successfully';
        },
        error: 'Failed to remove task 🥲',
      });
    });
  }

  function handleExportTask(task: TaskItem) {
    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session expired');
        return;
      }

      const newTaskLibrary: CreateTaskLibrary = {
        id: uuidv4(),
        taskActivity: task.taskActivity,
        description: task.description,
        taskType: task.taskType,
        listChoice: task.listChoice,
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

  function handleSaveEditTask() {
    console.log(tmpTask);
  }

  function handleCancelEditTask() {
    setTaskId(null);
  }

  // function handleTaskUpdate(id: string, value: string) {
  //   console.log(id, value);
  // }

  // function handleTaskActivityChange(taskActivity: string) {
  //   setTmpActivity(taskActivity);
  // }

  // function handleTaskDescriptionChange(description: string) {
  //   setTmpDescription(description);
  // }

  return taskList.length > 0 ? (
    //             {editingTaskId === task.id ? (
    //               // TODO: use TaskValueEdit component instead
    //               <Popover placement="bottom" showArrow offset={10}>
    //                 <PopoverTrigger>
    //                   <Button variant="faded" size="sm" color="primary">
    //                     {task.taskType
    //                       .replace(/_/g, ' ')
    //                       .toLowerCase()
    //                       .replace(/(?:^|\s)\S/g, function (char) {
    //                         return char.toUpperCase();
    //                       })}
    //                   </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-[240px]">
    //                   {titleProps => (
    //                     <div className="w-full px-1 py-2">
    //                       <p
    //                         className="text-small font-bold text-foreground"
    //                         {...titleProps}
    //                       >
    //                         Value Type
    //                       </p>
    //                       <div className="mt-2 flex w-full flex-col gap-2">
    //                         <Input
    //                           defaultValue="100%"
    //                           label="Width"
    //                           size="sm"
    //                           variant="bordered"
    //                         />
    //                         <Input
    //                           defaultValue="300px"
    //                           label="Max. width"
    //                           size="sm"
    //                           variant="bordered"
    //                         />
    //                         <Input
    //                           defaultValue="24px"
    //                           label="Height"
    //                           size="sm"
    //                           variant="bordered"
    //                         />
    //                         <Input
    //                           defaultValue="30px"
    //                           label="Max. height"
    //                           size="sm"
    //                           variant="bordered"
    //                         />
    //                       </div>
    //                     </div>
    //                   )}
    //                 </PopoverContent>
    //               </Popover>
    //             ) : (
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
          <TableRow key={row.id} noHover>
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
  );
}
