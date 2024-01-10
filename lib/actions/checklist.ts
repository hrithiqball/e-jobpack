'use server';

import { Checklist, Prisma } from '@prisma/client';

import { db } from '@/lib/prisma/db';

export async function createChecklist(data: Checklist) {
  try {
    const newChecklist: Checklist = await db.checklist.create({
      data,
    });

    return newChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchChecklistList(maintenance_uid?: string) {
  try {
    const filters: Prisma.ChecklistWhereInput[] = [];
    const orderBy: Prisma.ChecklistOrderByWithRelationInput[] = [];

    if (maintenance_uid) {
      filters.push({
        maintenance_uid,
      });
    }

    orderBy.push({
      title: 'asc',
    });

    return await db.checklist.findMany({
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
