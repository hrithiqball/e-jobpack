'use server';

import { revalidatePath } from 'next/cache';
import { Prisma, TaskType } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import {
  CreateMaintenance,
  UpdateMaintenance,
} from '@/lib/schemas/maintenance';
import { ExtendedUser } from '@/types/next-auth';
import dayjs from 'dayjs';
import { MaintenanceItem } from '@/types/maintenance';
import { ServerResponseSchema } from '@/lib/schemas/server-response';

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

export async function createMaintenance(
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

export async function fetchMaintenanceItem(id: string) {
  try {
    return await db.maintenance.findUniqueOrThrow({
      where: { id },
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

export async function fetchMutatedMaintenanceItem(id: string) {
  try {
    const maintenance = await db.maintenance.findUniqueOrThrow({
      where: { id },
      include: {
        checklist: {
          include: {
            asset: true,
            createdBy: true,
            updatedBy: true,
            task: {
              orderBy: { taskOrder: 'asc' },
              include: {
                subtask: {
                  orderBy: { taskOrder: 'asc' },
                },
              },
            },
          },
        },
        approvedBy: true,
        closedBy: true,
        rejectedBy: true,
        requestedBy: true,
      },
    });

    const assetOptionsList = await db.asset.findMany({
      where: {
        id: {
          notIn: maintenance.checklist.map(checklist => checklist.assetId),
        },
      },
    });

    return {
      ...maintenance,
      assetOptionsList,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList(assetIds?: string) {
  try {
    const filters: Prisma.MaintenanceWhereInput[] = [];
    const orderBy: Prisma.MaintenanceOrderByWithRelationInput[] = [];

    if (assetIds) {
      filters.push({
        assetIds: {
          hasSome: assetIds.split(','),
        },
      });
    }

    orderBy.push({
      date: 'desc',
    });

    const maintenanceList = await db.maintenance.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });

    revalidatePath('/task');
    return maintenanceList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList2() {
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
        checklist: {
          include: {
            asset: true,
            createdBy: true,
            updatedBy: true,
            task: {
              orderBy: { taskOrder: 'asc' },
              include: {
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

export async function updateMaintenance(
  id: string,
  values: z.infer<typeof UpdateMaintenance>,
) {
  try {
    const validatedFields = UpdateMaintenance.safeParse(values);

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

export async function uploadMaintenanceImage(
  maintenance: MaintenanceItem,
  formData: FormData,
) {
  try {
    const url = `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/maintenance/upload`;

    const response = await fetch(url, {
      body: formData,
    });

    const data = await response.json();
    const validateResponse = ServerResponseSchema.safeParse(data);

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
