'use server';

import { revalidatePath } from 'next/cache';
import { Maintenance, Prisma } from '@prisma/client';
import z from 'zod';

import { db } from '@/lib/db';
import {
  CreateMaintenance,
  UpdateMaintenance,
} from '@/lib/schemas/maintenance';
import { ExtendedUser } from '@/types/next-auth';
import dayjs from 'dayjs';

export async function createMaintenance(
  user: ExtendedUser,
  values: z.infer<typeof CreateMaintenance>,
) {
  try {
    const validatedFields = CreateMaintenance.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    const maintainee = validatedFields.data.maintainee?.toString();

    const maintenance = await db.maintenance
      .create({
        data: {
          ...validatedFields.data,
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

export async function fetchMaintenanceList(
  assetIds?: string,
): Promise<Maintenance[]> {
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
