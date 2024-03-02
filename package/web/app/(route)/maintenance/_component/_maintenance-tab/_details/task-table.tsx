import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Checklist } from '@/types/maintenance';

import TaskTypeHelper from '@/components/helper/TaskTypeHelper';
import TableAssigneeCell from './assignee-cell';

type Task = Checklist['task'][0];

type TaskTableProps = {
  taskList: Task[];
};

export default function TaskTable({ taskList }: TaskTableProps) {
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
        return <p>{row.original.taskCheck ? 'yes' : 'no'}</p>;
      },
    },
    {
      accessorKey: 'taskAssignee',
      cell: ({ row }) => {
        const assignee = row.original.taskAssignee.map(ta => ta.user);

        return (
          <TableAssigneeCell taskId={row.original.id} assignee={assignee} />
        );
      },
    },
  ];

  const table = useReactTable({
    data: taskList,
    columns,
    getCoreRowModel: getCoreRowModel<Task>(),
  });

  return (
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
  );
}
