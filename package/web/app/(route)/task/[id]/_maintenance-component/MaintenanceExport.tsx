import { useState, useTransition, useEffect } from 'react';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { Checkbox } from '@nextui-org/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import {
  CreateMaintenanceLibrary,
  CreateMaintenanceLibraryForm,
  CreateMaintenanceLibraryFormSchema,
} from '@/lib/schemas/maintenance';
import { ChecklistSchema } from '@/lib/schemas/checklist';
import { createMaintenanceLibrary } from '@/lib/actions/maintenance-library';

type MaintenanceExportProps = {
  open: boolean;
  onClose: () => void;
};

export default function MaintenanceExport({
  open,
  onClose,
}: MaintenanceExportProps) {
  const [transitioning, startTransition] = useTransition();
  const user = useCurrentUser();

  const { maintenance } = useMaintenanceStore();

  const [selectedChecklists, setSelectedChecklists] = useState(
    maintenance?.checklist.map(checklist => ({
      id: checklist.id,
      asset: checklist.asset,
      isSelected: true,
      task: checklist.task.map(task => ({
        ...task,
        subtask: task.subtask.map(subtask => ({
          ...subtask,
        })),
      })),
    })),
  );

  useEffect(() => {
    if (!maintenance) return;

    setSelectedChecklists(
      maintenance.checklist.map(checklist => ({
        id: checklist.id,
        asset: checklist.asset,
        isSelected: true,
        task: checklist.task.map(task => ({
          ...task,
          subtask: task.subtask.map(subtask => ({
            ...subtask,
          })),
        })),
      })),
    );
  }, [maintenance]);

  const form = useForm<CreateMaintenanceLibraryForm>({
    resolver: zodResolver(CreateMaintenanceLibraryFormSchema),
    defaultValues: {
      description: '  ',
    },
  });

  function toggleChecklist(checklistId: string) {
    setSelectedChecklists(checklists =>
      checklists?.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              isSelected: !checklist.isSelected,
            }
          : checklist,
      ),
    );
  }

  function onSubmit(data: CreateMaintenanceLibraryForm) {
    console.log(data);

    startTransition(() => {
      if (user === undefined || user.id === undefined) {
        toast.error('User session is expired');
        return;
      }

      if (selectedChecklists === undefined) {
        toast.error('No checklist selected');
        return;
      }

      const checklistLibraries: z.infer<typeof ChecklistSchema>[] = [];

      selectedChecklists
        .filter(checklist => checklist.isSelected)
        .forEach(checklist => {
          const checklistId = uuidv4();

          const checklistLibrary = {
            id: checklistId,
            title: checklist.asset.name,
            description: checklist.asset.description,
            assetId: checklist.asset.id,
            createdById: user.id,
            updatedById: user.id,
            taskLibrary: checklist.task.map(task => {
              const taskId = uuidv4();

              return {
                id: taskId,
                checklistLibraryId: checklistId,
                taskActivity: task.taskActivity,
                description: task.description,
                taskOrder: task.taskOrder,
                taskType: task.taskType,
                createdById: user.id,
                updatedById: user.id,
                listChoice:
                  task.taskType === 'MULTIPLE_SELECT' ||
                  task.taskType === 'SINGLE_SELECT'
                    ? task.listChoice
                    : [],
                subtaskLibrary: task.subtask.map(subtask => {
                  return {
                    taskLibraryId: taskId,
                    id: uuidv4(),
                    taskActivity: subtask.taskActivity,
                    description: subtask.description,
                    taskOrder: subtask.taskOrder,
                    taskType: subtask.taskType,
                    createdById: user.id,
                    updatedById: user.id,
                    listChoice:
                      subtask.taskType === 'MULTIPLE_SELECT' ||
                      subtask.taskType === 'SINGLE_SELECT'
                        ? subtask.listChoice
                        : [],
                  };
                }),
              };
            }),
          };

          const validatedChecklist =
            ChecklistSchema.safeParse(checklistLibrary);

          if (!validatedChecklist.success) {
            console.log(validatedChecklist.error);
            return;
          }

          checklistLibraries.push(validatedChecklist.data);
        });

      const newMaintenanceLibrary: CreateMaintenanceLibrary = {
        title: data.title,
        description: data.description,
        createdById: user.id,
        updatedById: user.id,
        checklistLibrary: checklistLibraries,
      };

      toast.promise(createMaintenanceLibrary(newMaintenanceLibrary), {
        loading: 'Creating maintenance library...',
        success: res => {
          onClose();
          return `Maintenance ${res.title} library successfully created!`;
        },
        error: 'Failed to create maintenance library 😢',
      });
    });
  }

  function handleClose() {
    onClose();
  }

  return (
    maintenance && (
      <Drawer open={open} onClose={handleClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Export Maintenance</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4 p-4">
            <Form {...form}>
              <form
                id="create-maintenance-lib"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Title <sup className="text-red-500">*</sup>
                        </FormLabel>
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
                </div>
              </form>
            </Form>
            {selectedChecklists !== undefined &&
              maintenance.checklist.map(checklist => (
                <Checkbox
                  key={checklist.id}
                  isSelected={
                    selectedChecklists.find(
                      selectedChecklist =>
                        selectedChecklist.id === checklist.id,
                    )?.isSelected
                  }
                  onValueChange={() => toggleChecklist(checklist.id)}
                >
                  {checklist.asset.name}
                </Checkbox>
              ))}
          </div>
          <DrawerFooter>
            <Button
              type="submit"
              form="create-maintenance-lib"
              disabled={transitioning}
            >
              Export
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  );
}
