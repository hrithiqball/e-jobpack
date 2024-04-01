import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { Maintenance } from '@/types/maintenance';

import { useCurrentUser } from '@/hooks/use-current-user';

import { CreateTaskLibrary } from '@/lib/schemas/task';
import { createChecklistLibrary } from '@/data/checklist-library.action';
import {
  ExportChecklistForm,
  ExportChecklistFormSchema,
} from '@/lib/schemas/checklist';
import { CreateSubtaskLibrary } from '@/lib/schemas/subtask';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@nextui-org/react';

type ChecklistExportModalProps = {
  open: boolean;
  onClose: () => void;
  checklist: Maintenance['checklist'][0];
};

export default function ChecklistExportModal({
  open,
  onClose,
  checklist,
}: ChecklistExportModalProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const [selectedTasks, setSelectedTasks] = useState(
    checklist.task.map(task => ({
      id: task.id,
      taskActivity: task.taskActivity,
      description: task.description,
      taskType: task.taskType,
      listChoice: task.listChoice,
      taskOrder: task.taskOrder,
      isSelected: true,
      subtask: task.subtask.map(subtask => ({
        ...subtask,
        isSelected: true,
      })),
    })),
  );

  const form = useForm<ExportChecklistForm>({
    resolver: zodResolver(ExportChecklistFormSchema),
  });

  function handleClose() {
    onClose();
  }

  function toggleTask(taskId: string) {
    setSelectedTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, isSelected: !task.isSelected } : task,
      ),
    );
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    setSelectedTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtask: task.subtask.map(subtask =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      isSelected: !subtask.isSelected,
                    }
                  : subtask,
              ),
            }
          : task,
      ),
    );
  }

  function onSubmit(data: ExportChecklistForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      const taskList: CreateTaskLibrary[] = [];
      const subtaskList: CreateSubtaskLibrary[] = [];

      selectedTasks
        .filter(task => task.isSelected)
        .forEach(task => {
          const taskLibrary: CreateTaskLibrary = {
            id: task.id,
            taskActivity: task.taskActivity,
            description: task.description,
            taskType: task.taskType,
            taskOrder: task.taskOrder,
            listChoice:
              task.taskType === 'MULTIPLE_SELECT' ||
              task.taskType === 'SINGLE_SELECT'
                ? task.listChoice
                : [],
          };

          const filteredSubtasks = task.subtask.filter(
            subtask => subtask.isSelected,
          );
          const subtaskLibraries: CreateSubtaskLibrary[] = filteredSubtasks.map(
            subtask =>
              ({
                taskId: subtask.taskId,
                taskActivity: subtask.taskActivity,
                description: subtask.description,
                taskType: subtask.taskType,
                taskOrder: subtask.taskOrder,
                listChoice:
                  subtask.taskType === 'MULTIPLE_SELECT' ||
                  subtask.taskType === 'SINGLE_SELECT'
                    ? subtask.listChoice
                    : [],
              }) satisfies CreateSubtaskLibrary,
          );

          subtaskList.push(...subtaskLibraries);
          taskList.push(taskLibrary);
        });

      toast.promise(
        createChecklistLibrary(
          user.id,
          checklist.asset.id,
          data,
          taskList,
          subtaskList,
        ),
        {
          loading: 'Exporting...',
          success: res => {
            return `${res.title} has been exported!`;
          },
          error: 'Something went wrong, please try again later.',
        },
      );
    });

    console.log(data);
  }

  return isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Export as library</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="export-checklist-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {checklist.task.map(task => (
              <div key={task.id} className="flex items-center">
                <Checkbox
                  isSelected={
                    selectedTasks.find(
                      selectedTask => selectedTask.id === task.id,
                    )?.isSelected
                  }
                  onValueChange={() => toggleTask(task.id)}
                >
                  {task.taskActivity}
                </Checkbox>
                {task.subtask.map(subtask => (
                  <div key={subtask.id} className="flex items-center">
                    <Checkbox
                      isSelected={
                        selectedTasks.find(
                          selectedTask =>
                            selectedTask.id === task.id &&
                            selectedTask.subtask.find(
                              selectedSubtask =>
                                selectedSubtask.id === subtask.id,
                            ),
                        )?.isSelected
                      }
                      onValueChange={() => toggleSubtask(task.id, subtask.id)}
                    >
                      {subtask.taskActivity}
                    </Checkbox>
                  </div>
                ))}
              </div>
            ))}
          </form>
        </Form>
        <SheetFooter>
          <Button
            type="submit"
            form="export-checklist-form"
            variant="outline"
            disabled={transitioning}
          >
            Export
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Export as library</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="outline" disabled={transitioning}>
            Export
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
