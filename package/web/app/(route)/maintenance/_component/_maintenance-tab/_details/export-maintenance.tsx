import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
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
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMaintenanceStore } from '@/hooks/use-maintenance.store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ChecklistSchema } from '@/lib/schemas/checklist';
import {
  CreateMaintenanceLibrary,
  CreateMaintenanceLibraryForm,
  CreateMaintenanceLibraryFormSchema,
} from '@/lib/schemas/maintenance';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@nextui-org/react';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { createMaintenanceLibrary } from '@/data/maintenance-library.action';

type MaintenanceExportProps = {
  open: boolean;
  onClose: () => void;
};

export default function ExportMaintenance({
  open,
  onClose,
}: MaintenanceExportProps) {
  const [transitioning, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const user = useCurrentUser();

  const { maintenance } = useMaintenanceStore();

  const [selectedChecklist, setSelectedChecklist] = useState(
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

    setSelectedChecklist(
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
    defaultValues: {},
  });

  function handleClose() {
    onClose();
  }

  function onSubmit(data: CreateMaintenanceLibraryForm) {
    startTransition(() => {
      if (!user || !user.id) {
        toast.error('Session expired');
        return;
      }

      if (selectedChecklist === undefined) {
        toast.error('No checklist selected');
        return;
      }

      const checklistLibraries: z.infer<typeof ChecklistSchema>[] = [];

      selectedChecklist
        .filter(checklist => checklist.isSelected)
        .forEach(checklist => {
          const checklistId = uuidv4();

          const checklistLibrary = {
            id: checklistId,
            title: checklist.asset.name,
            description: checklist.asset.description || '',
            assetId: checklist.asset.id,
            createdById: user.id,
            updatedById: user.id,
            taskLibrary: checklist.task.map(task => {
              const taskId = uuidv4();

              return {
                id: taskId,
                checklistLibraryId: checklistId,
                taskActivity: task.taskActivity,
                description: task.description || '',
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
                    description: subtask.description || '',
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
        description: data.description || '',
        createdById: user.id,
        updatedById: user.id,
        checklistLibrary: checklistLibraries,
      };

      toast.promise(createMaintenanceLibrary(newMaintenanceLibrary), {
        loading: 'Exporting maintenance...',
        success: res => {
          onClose();
          return `Maintenance ${res.title} have successfully exported`;
        },
        error: 'Failed to export maintenance 😥',
      });
    });
  }

  function toggleChecklist(checklistId: string) {
    setSelectedChecklist(checklists =>
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

  return maintenance && isDesktop ? (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Export</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id="export-maintenance-main"
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
        <div className="flex flex-col">
          {selectedChecklist &&
            maintenance.checklist.map(checklist => (
              <Checkbox
                key={checklist.id}
                isSelected={
                  selectedChecklist.find(
                    selectedChecklist => selectedChecklist.id === checklist.id,
                  )?.isSelected
                }
                onValueChange={() => toggleChecklist(checklist.id)}
              >
                {checklist.asset.name}
              </Checkbox>
            ))}
        </div>
        <SheetFooter>
          <Button
            type="submit"
            form="export-maintenance-main"
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
          <DrawerTitle>Export</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
