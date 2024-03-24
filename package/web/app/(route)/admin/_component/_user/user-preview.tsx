import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useUserStore } from '@/hooks/use-user.store';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { isNullOrEmpty } from '@/lib/function/string';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DepartmentEnum, RoleEnum } from '@/types/enum';
import { useState, useTransition } from 'react';
import { Department, Role } from '@prisma/client';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { adminBlockUser, adminUpdateUser } from '@/data/user.action';
import { AdminUpdateUser } from '@/lib/schemas/user';

type UserPreviewProps = {
  open: boolean;
  onClose: () => void;
};

export default function UserPreview({ open, onClose }: UserPreviewProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { currentUser } = useUserStore();

  const [roleValue, setRoleValue] = useState(currentUser?.role);
  const [departmentValue, setDepartmentValue] = useState(
    currentUser?.department,
  );

  function handleRoleChange(value: string) {
    const role = value as Role;
    setRoleValue(role);
  }

  function handleDepartmentChange(value: string) {
    const department = value as Department;
    setDepartmentValue(department);
  }

  function handleBlockUser() {
    startTransition(() => {
      if (!currentUser) {
        toast.error('User not found');
        return;
      }

      toast.promise(adminBlockUser(currentUser.id), {
        loading: 'Blocking user...',
        success: 'User blocked successfully',
        error: 'Failed to block user',
      });
    });
  }

  function handleUpdateUser() {
    startTransition(() => {
      if (!currentUser) {
        toast.error('User not found');
        return;
      }

      if (!roleValue || !departmentValue) {
        toast.error('Role and department are required');
        return;
      }

      const updatedUser: AdminUpdateUser = {
        id: currentUser.id,
        departmentId: departmentValue,
        role: roleValue,
      };

      toast.promise(adminUpdateUser(updatedUser), {
        loading: 'Updating user...',
        success: 'User updated successfully',
        error: 'Failed to update user',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  if (!currentUser) return null;

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{currentUser.name}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Mail size={18} />
            <div className="flex items-center space-x-1">
              <ExternalLink size={18} />
              <Link
                target="_blank"
                href={`mailto:${currentUser.email}`}
                className="hover:text-blue-500 hover:underline"
              >
                {currentUser.email}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Phone size={18} />
            {isNullOrEmpty(currentUser.phone) ? (
              <div className="flex items-center space-x-1">
                <ExternalLink size={18} />
                <Link
                  target="_blank"
                  href={`https://wa.me/6${currentUser.phone}`}
                  className="hover:text-blue-500 hover:underline"
                >
                  {currentUser.phone}
                </Link>
              </div>
            ) : (
              <p>No Phone</p>
            )}
          </div>
        </div>
        {roleValue && (
          <div className="flex flex-col space-y-3">
            <Label>Role</Label>
            <Select value={roleValue} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RoleEnum.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {departmentValue && (
          <div className="flex flex-col space-y-3">
            <Label>Department</Label>
            <Select
              value={departmentValue}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DepartmentEnum.map(department => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <SheetFooter>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="destructive" size="default">
                Block
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure</AlertDialogTitle>
                <AlertDialogDescription>
                  Blocking this user will prevent them from accessing the
                  system. You can unblock them later.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={transitioning}
                    onClick={handleBlockUser}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            disabled={
              currentUser.department === departmentValue ||
              currentUser.role === roleValue ||
              transitioning
            }
            onClick={handleUpdateUser}
          >
            Update
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerHeader>
            <DrawerTitle>{currentUser.name}</DrawerTitle>
          </DrawerHeader>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
