'use server';

import { revalidatePath } from 'next/cache';
import { Asset, Maintenance, Prisma } from '@prisma/client';
import z from 'zod';

import { db } from '@/lib/db';
import {
  CreateMaintenance,
  UpdateMaintenance,
} from '@/lib/schemas/maintenance';

export async function createMaintenance(
  values: z.infer<typeof CreateMaintenance>,
) {
  try {
    const validatedFields = CreateMaintenance.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    const maintainee = validatedFields.data.maintainee?.toString();

    return await db.maintenance.create({
      data: {
        ...validatedFields.data,
        date: new Date(),
        maintainee,
      },
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
    });

    let assetList: Asset[] = [];

    maintenance.assetIds.forEach(async assetId => {
      const asset = await db.asset.findUnique({
        where: { id: assetId },
      });
      if (asset) {
        assetList.push(asset);
      }
    });

    const checklistList = await db.checklist.findMany({
      where: {
        maintenanceId: id,
      },
    });

    const mutatedChecklist = Promise.all(
      checklistList.map(async checklist => {
        const taskList = await db.task.findMany({
          where: {
            checklistId: checklist.id,
          },
        });

        const tasksWithSubtasks = await Promise.all(
          taskList.map(async task => {
            if (task.haveSubtask) {
              const subtaskList = await db.subtask.findMany({
                where: {
                  taskId: task.id,
                },
              });

              return {
                ...task,
                subtasks: subtaskList,
              };
            } else {
              return task;
            }
          }),
        );

        return {
          ...checklist,
          tasks: tasksWithSubtasks,
        };
      }),
    );

    const assetOptionsList = await db.asset.findMany({
      where: {
        NOT: {
          id: {
            in: maintenance.assetIds,
          },
        },
      },
    });

    return {
      maintenance,
      assetList,
      assetOptionsList,
      checklists: mutatedChecklist,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList(
  assetIds?: string,
): Promise<Maintenance[]> {
  try {
    const filters: Prisma.MaintenanceWhereInput[] = [];
    const orderBy: Prisma.MaintenanceOrderByWithRelationInput[] = [];

    console.log(assetIds);

    // if (assetIds) {
    //   filters.push({
    //     assetIds ,
    //   });
    // }

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

export async function updateMaintenance(
  id: string,
  values: z.infer<typeof UpdateMaintenance>,
) {
  try {
    const validatedFields = UpdateMaintenance.safeParse(values);

    if (!validatedFields.success) {
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
