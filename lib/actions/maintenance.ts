'use server';

import { Maintenance, Prisma } from '@prisma/client';

import { db } from '@/lib/prisma/db';

export async function createMaintenance(data: Maintenance) {
  try {
    return await db.maintenance.create({
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceItem(id: string) {
  try {
    return await db.maintenance.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList(
  assetId?: string,
): Promise<Maintenance[]> {
  try {
    const filters: Prisma.MaintenanceWhereInput[] = [];
    const orderBy: Prisma.MaintenanceOrderByWithRelationInput[] = [];

    if (assetId) {
      filters.push({
        assetId,
      });
    }

    orderBy.push({
      date: 'desc',
    });

    return await db.maintenance.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
