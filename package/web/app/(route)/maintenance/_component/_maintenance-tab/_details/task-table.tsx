import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Checklist } from '@/types/maintenance';

import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import TableAssigneeCell from './assignee-cell';
import TableTaskCompleteCell from './task-complete-cell';
import { Button } from '@/components/ui/button';
import {
  Contact2,
  MessageCircleMore,
  MessageCircleWarning,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { isNullOrEmpty } from '@/lib/function/string';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

type Task = Checklist['task'][0];

type TaskTableProps = {
  taskList: Task[];
};

export default function TaskTable({ taskList }: TaskTableProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    issue: false,
    remarks: false,
  });

  useEffect(() => {
    setColumnVisibility({
      issue: isDesktop,
      remarks: isDesktop,
      taskAssignee: isDesktop,
    });
  }, [isDesktop]);

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'taskActivity',
      cell: ({ row }) => {
        const description = row.original.description;

        return (
          <div className="flex items-center space-x-4">
            <TaskTypeHelper size={18} taskType={row.original.taskType} />
            <div className="flex flex-col">
              <p>{row.original.taskActivity}</p>
              <p className="text-xs text-gray-400">
                {description === '' || !description
                  ? 'No description'
                  : description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'isCompleted',
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <TableTaskCompleteCell task={row.original} />
          </div>
        );
      },
    },
    {
      accessorKey: 'taskAssignee',
      cell: ({ row }) => {
        const assignee =
          row.original.taskAssignee && row.original.taskAssignee.length > 0
            ? row.original.taskAssignee.map(ta => ta.user)
            : [];

        return (
          <TableAssigneeCell taskId={row.original.id} assignee={assignee} />
        );
      },
    },
    {
      accessorKey: 'issue',
      cell: ({ row }) => {
        const issue = row.original.issue;

        return isNullOrEmpty(issue) ? (
          <p>{issue}</p>
        ) : (
          <p className="text-gray-400">No Issue</p>
        );
      },
    },
    {
      accessorKey: 'remarks',
      cell: ({ row }) => {
        const remarks = row.original.remarks;

        return isNullOrEmpty(remarks) ? (
          <p>{remarks}</p>
        ) : (
          <p className="text-gray-400">No Remarks</p>
        );
      },
    },
  ];

  const table = useReactTable({
    data: taskList,
    columns,
    getCoreRowModel: getCoreRowModel<Task>(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  function toggleIssue() {
    setColumnVisibility(prev => ({
      ...prev,
      issue: !prev.issue,
    }));
  }

  function toggleRemarks() {
    setColumnVisibility(prev => ({
      ...prev,
      remarks: !prev.remarks,
    }));
  }

  function toggleAssignee() {
    setColumnVisibility(prev => ({
      ...prev,
      taskAssignee: !prev.taskAssignee,
    }));
  }

  return (
    <div className="flex flex-col space-y-4">
      <div
        className={cn('flex items-center space-x-4', {
          'space-x-2': !isDesktop,
        })}
      >
        <Button
          variant="ghost"
          size="withIcon"
          onClick={toggleIssue}
          className={cn('max-w-min', {
            'bg-teal-700 text-white dark:bg-teal-900': columnVisibility.issue,
          })}
        >
          <MessageCircleWarning size={18} />
          {isDesktop && (
            <p>{columnVisibility.issue ? 'Hide Issue' : 'View Issue'}</p>
          )}
        </Button>
        <Button
          variant="ghost"
          size="withIcon"
          onClick={toggleRemarks}
          className={cn('max-w-min', {
            'bg-teal-700 text-white dark:bg-teal-900': columnVisibility.remarks,
          })}
        >
          <MessageCircleMore size={18} />
          {isDesktop && (
            <p>{columnVisibility.remarks ? 'Hide Remarks' : 'View Remarks'}</p>
          )}
        </Button>
        {!isDesktop && (
          <Button
            variant="ghost"
            size="withIcon"
            onClick={toggleAssignee}
            className={cn('max-w-min', {
              'bg-teal-700 text-white dark:bg-teal-900':
                columnVisibility.taskAssignee,
            })}
          >
            <Contact2 size={18} />
          </Button>
        )}
      </div>
      <Table>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow noHover key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
