import { Fragment, useState, useTransition } from 'react';
import { User } from '@prisma/client';
import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip } from '@nextui-org/react';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

import { useUserStore } from '@/hooks/use-user.store';
import { assignTask } from '@/lib/actions/task-assignee';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type TableAssigneeCellProps = {
  assignee: User[];
  taskId: string;
};

export default function TableAssigneeCell({
  assignee,
  taskId,
}: TableAssigneeCellProps) {
  const [transitioning, startTransition] = useTransition();

  const { userList } = useUserStore();

  const [assigneeList, setAssigneeList] = useState(assignee);
  const [userListValue, setUserListValue] = useState(
    userList
      .filter(user => user.id !== '-99')
      .map(user => ({
        ...user,
        checked: assignee.some(au => au.id === user.id),
      })),
  );

  function handleCheckChange(userId: string) {
    const updatedUserList = userListValue.map(user =>
      user.id === userId ? { ...user, checked: !user.checked } : user,
    );

    setUserListValue(updatedUserList);
  }

  function updateAssignee() {
    const updateAssigneeList = userListValue
      .filter(user => user.checked)
      .map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ checked, ...userProps }) => ({
          ...userProps,
        }),
      );

    setAssigneeList(updateAssigneeList);
  }

  function handleClose(opened: boolean) {
    if (opened) return;

    const checkedCount = userListValue.filter(user => user.checked).length;

    if (checkedCount === assigneeList.length) return;

    startTransition(() => {
      toast.promise(
        assignTask(
          taskId,
          userListValue.map(user => ({
            userId: user.id,
            checked: user.checked,
          })),
        ),
        {
          loading: 'Assigning task...',
          success: () => {
            updateAssignee();
            return 'Task assigned successfully';
          },
          error: 'Failed to assign task',
        },
      );
    });
  }

  return (
    <DropdownMenu onOpenChange={handleClose}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={transitioning}>
          {assigneeList.length > 0 ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {assigneeList.length === 1 ? (
                  <Fragment>
                    <div className="flex size-6 items-center justify-center rounded-full bg-gray-400">
                      {assigneeList[0]!.image ? (
                        <Image
                          src={`${baseServerUrl}/user/${assigneeList[0]!.image}`}
                          alt={assigneeList[0]!.name}
                          width={6}
                          height={6}
                          className="size-6 rounded-full"
                        />
                      ) : (
                        <p className="text-xs">
                          {assigneeList[0]!.name.substring(0, 1)}
                        </p>
                      )}
                    </div>
                    {assigneeList.length === 1 && (
                      <p>{assigneeList[0]!.name}</p>
                    )}
                  </Fragment>
                ) : (
                  assigneeList.slice(0, 2).map(user => (
                    <Tooltip key={user.id} content={user.name}>
                      <div className="flex size-6 items-center justify-center rounded-full bg-gray-400">
                        {user.image ? (
                          <Image
                            src={`${baseServerUrl}/user/${user.image}`}
                            alt={user.name}
                            width={6}
                            height={6}
                            className="size-6 rounded-full"
                          />
                        ) : (
                          <p className="text-xs">{user.name.substring(0, 1)}</p>
                        )}
                      </div>
                    </Tooltip>
                  ))
                )}
              </div>
              {assigneeList.length > 2 && (
                <p className="text-small font-medium text-foreground">
                  +{assigneeList.length - 2} others
                </p>
              )}
            </div>
          ) : (
            <p>Not Assigned</p>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 rounded-lg p-2">
        {userListValue.map(user => (
          <DropdownMenuCheckboxItem
            key={user.id}
            checked={user.checked}
            onCheckedChange={() => {
              handleCheckChange(user.id);
            }}
            onSelect={e => e.preventDefault()}
            className="w-full"
          >
            <div className="flex items-center space-x-1">
              {user.image ? (
                <Image
                  src={`${baseServerUrl}/user/${user.image}`}
                  alt={user.name}
                  width={6}
                  height={6}
                  className="size-5 rounded-full"
                />
              ) : (
                <div className="flex size-5 items-center justify-center rounded-full bg-gray-400">
                  <p className="text-xs">{user.name.substring(0, 1)}</p>
                </div>
              )}
              <span>{user.name}</span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
