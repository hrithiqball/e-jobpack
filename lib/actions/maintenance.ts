'use server';

import { revalidatePath } from 'next/cache';
import { Maintenance, Prisma } from '@prisma/client';
import z from 'zod';
import dayjs from 'dayjs';

import { db } from '@/lib/prisma/db';
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

    return await db.maintenance.create({
      data: {
        ...validatedFields.data,
        date: new Date(),
        id: `WO-${dayjs().format('YYMMDDHHmmssSSS')}`,
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
