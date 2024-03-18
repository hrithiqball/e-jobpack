'use server';

import { revalidatePath } from 'next/cache';
import {
  ChecklistLibrary,
  Prisma,
  SubtaskLibrary,
  TaskLibrary,
  TaskType,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import dayjs from 'dayjs';

import { db } from '@/lib/db';
import { MaintenanceItem } from '@/types/maintenance';
import { ExtendedUser } from '@/types/next-auth';
import {
  CreateMaintenance,
  CreateMaintenanceType,
  UpdateMaintenance,
  UpdateMaintenanceForm,
  UpdateMaintenanceSchema,
} from '@/lib/schemas/maintenance';
import { ServerResponseSchema } from '@/lib/schemas/server-response';
import { DateRange } from 'react-day-picker';

type ExtendedTaskLibrary = TaskLibrary & {
  subtaskLibrary: SubtaskLibrary[];
};

type ExtendedChecklistLibrary = ChecklistLibrary & {
  taskLibrary: ExtendedTaskLibrary[];
};

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

const MaintenanceRecreateFormSchema = z.object({
  id: z.string().min(1, { message: 'Maintenance ID is required' }),
  // startDate: z.date({ required_error: 'Start date is required' }),
  // deadline: z.date().optional().nullable(),
  approvedById: z
    .string()
    .min(1, { message: 'Person in charge is required for approval' }),
});

type MaintenanceRecreateForm = z.infer<typeof MaintenanceRecreateFormSchema>;

type RecreateMaintenanceChecklist = {
  assetId: string;
  taskList:
    | null
    | undefined
    | {
        id: string;
        taskActivity: string;
        description: string | null;
        taskType: TaskType;
        listChoice: string[];
        taskOrder: number;
      }[];
  checklistLibraryId: string | null;
};

export async function createMaintenance2(
  user: ExtendedUser,
  newMaintenance: CreateMaintenance,
) {
  try {
    const maintainee = newMaintenance.maintainee?.toString() || null;

    const maintenance = await db.maintenance
      .create({
        data: {
          ...newMaintenance,
          requestedById: user.id,
          date: new Date(),
          maintainee,
        },
      })
      .then(async res => {
        res.assetIds.forEach(async assetId => {
          await db.checklist.create({
            data: {
              id: `CL-${dayjs().format('YYMMDDHHmmssSSS')}`,
              assetId,
              maintenanceId: res.id,
              createdById: user.id,
              updatedById: user.id,
            },
          });
        });

        const activity =
          user.role === 'TECHNICIAN'
            ? `${user.name} requested a maintenance request`
            : `${user.name} created a maintenance`;

        await db.history.create({
          data: {
            actionBy: user.id,
            activity,
            historyMeta: 'MAINTENANCE',
            metaValue: res.id,
          },
        });
      });

    return maintenance;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createMaintenance(
  user: ExtendedUser,
  newMaintenance: CreateMaintenanceType,
) {
  try {
    return await db.maintenance
      .create({
        data: {
          requestedById: user.id,
          id: newMaintenance.id,
          maintenanceStatus:
            user.role === 'TECHNICIAN' ? 'REQUESTED' : 'OPENED',
          approvedById: newMaintenance.approvedById,
          startDate: newMaintenance.startDate,
          deadline: newMaintenance.deadline,
        },
      })
      .then(async res => {
        newMaintenance.checklist.forEach(async checklist => {
          let targetChecklist: ExtendedChecklistLibrary | null = null;

          if (checklist.checklistId) {
            targetChecklist = await db.checklistLibrary.findUnique({
              where: { id: checklist.checklistId },
              include: {
                taskLibrary: {
                  include: {
                    subtaskLibrary: true,
                  },
                },
              },
            });
          }

          await db.checklist
            .create({
              data: {
                id: uuidv4(),
                assetId: checklist.assetId,
                maintenanceId: res.id,
                createdById: user.id,
                updatedById: user.id,
              },
            })
            .then(async checklistRes => {
              if (targetChecklist) {
                targetChecklist.taskLibrary.forEach(async task => {
                  await db.task
                    .create({
                      data: {
                        id: uuidv4(),
                        taskActivity: task.taskActivity,
                        taskType: task.taskType,
                        listChoice: task.listChoice,
                        taskOrder: task.taskOrder,
                        description: task.description,
                        checklistId: checklistRes.id,
                      },
                    })
                    .then(async taskRes => {
                      if (task.subtaskLibrary) {
                        await db.subtask.createMany({
                          data: task.subtaskLibrary.map(subtask => ({
                            id: uuidv4(),
                            taskId: taskRes.id,
                            taskOrder: subtask.taskOrder,
                            taskActivity: subtask.taskActivity,
                            taskType: subtask.taskType,
                            listChoice: subtask.listChoice,
                            description: subtask.description,
                          })),
                        });
                      }
                    });
                });
              }
            });
        });
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function recreateMaintenance(
  user: ExtendedUser,
  form: MaintenanceRecreateForm,
  checklists: RecreateMaintenanceChecklist[],
) {
  try {
    return await db.maintenance
      .create({
        data: {
          ...form,
          maintenanceStatus:
            user.role === 'TECHNICIAN' ? 'REQUESTED' : 'OPENED',
          requestedById: user.role === 'TECHNICIAN' ? user.id : null,
        },
      })
      .then(async res => {
        checklists.forEach(async checklist => {
          await db.checklist
            .create({
              data: {
                id: uuidv4(),
                assetId: checklist.assetId,
                maintenanceId: res.id,
                createdById: user.id,
                updatedById: user.id,
              },
            })
            .then(async checklistRes => {
              if (checklist.taskList) {
                await db.task.createMany({
                  data: checklist.taskList.map(task => ({
                    ...task,
                    checklistId: checklistRes.id,
                  })),
                });
              }
            });
        });
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceItem(id: string) {
  try {
    return await db.maintenance.findUniqueOrThrow({
      where: { id },
      include: {
        approvedBy: true,
        closedBy: true,
        rejectedBy: true,
        requestedBy: true,
        maintenanceMember: true,
        checklist: {
          include: {
            asset: true,
            createdBy: true,
            updatedBy: true,
            task: {
              orderBy: { taskOrder: 'asc' },
              include: {
                taskAssignee: { include: { user: true } },
                subtask: {
                  orderBy: { taskOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList() {
  try {
    return await db.maintenance.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        approvedBy: true,
        closedBy: true,
        rejectedBy: true,
        requestedBy: true,
        maintenanceMember: true,
        checklist: {
          include: {
            asset: true,
            createdBy: true,
            updatedBy: true,
            task: {
              orderBy: { taskOrder: 'asc' },
              include: {
                taskAssignee: { include: { user: true } },
                subtask: {
                  orderBy: { taskOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateMaintenance(id: string, values: UpdateMaintenance) {
  try {
    const validatedFields = UpdateMaintenanceSchema.safeParse(values);

    if (!validatedFields.success) {
      console.error(validatedFields.error);
      throw new Error(validatedFields.error.message);
    }

    return await db.maintenance.update({
      where: { id },
      data: {
        ...validatedFields.data,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
    } else {
      console.error(error);
    }
    throw error;
  }
}

export async function updateMaintenanceDetails(
  maintenanceId: string,
  data: UpdateMaintenanceForm,
  dateRange: DateRange,
  memberList: { userId: string; checked: boolean }[],
) {
  try {
    const deleteTarget: string[] = [];

    for (const ml of memberList.filter(ml => !ml.checked)) {
      const record = await db.maintenanceMember.findUnique({
        where: {
          maintenanceId_userId: { maintenanceId, userId: ml.userId },
        },
      });

      if (record) {
        deleteTarget.push(record.userId);
      }
    }

    const removeOperations = deleteTarget.map(userId =>
      db.maintenanceMember.delete({
        where: { maintenanceId_userId: { maintenanceId, userId } },
      }),
    );

    const upsertOperations = memberList
      .filter(ml => ml.checked)
      .map(ml =>
        db.maintenanceMember.upsert({
          where: {
            maintenanceId_userId: { maintenanceId, userId: ml.userId },
          },
          update: { userId: ml.userId },
          create: { maintenanceId, userId: ml.userId },
        }),
      );

    const operations = [...removeOperations, ...upsertOperations];
    await Promise.all(operations);

    return await db.maintenance.update({
      where: { id: maintenanceId },
      data: {
        id: data.id,
        approvedById: data.approvedById,
        startDate: dateRange.from,
        deadline: dateRange.to || null,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadMaintenanceImage(
  maintenance: MaintenanceItem,
  formData: FormData,
) {
  try {
    const url = new URL('/maintenance/upload', baseUrl);

    const response = await (
      await fetch(url, {
        method: 'POST',
        body: formData,
      })
    ).json();

    const validateResponse = ServerResponseSchema.safeParse(response);

    if (!validateResponse.success) {
      throw new Error('Failed to upload image');
    }

    const attachmentPath = maintenance.attachmentPath || [];
    attachmentPath.push(validateResponse.data.path);

    const updatedMaintenance = await db.maintenance.update({
      where: { id: maintenance.id },
      data: { attachmentPath },
    });

    revalidatePath(`/maintenance/${maintenance.id}`);
    return updatedMaintenance;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
