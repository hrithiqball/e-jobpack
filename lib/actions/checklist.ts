'use server';

import { Checklist, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import z from 'zod';

import { db } from '@/lib/db';
import { CreateChecklist, UpdateChecklist } from '@/lib/schemas/checklist';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function createChecklist(values: z.infer<typeof CreateChecklist>) {
  try {
    const validatedFields = CreateChecklist.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    const newChecklist: Checklist = await db.checklist.create({
      data: {
        id: `CL-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedById: validatedFields.data.createdById,
        ...validatedFields.data,
      },
    });

    return newChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchChecklistList(maintenanceId?: string) {
  try {
    const filters: Prisma.ChecklistWhereInput[] = [];
    const orderBy: Prisma.ChecklistOrderByWithRelationInput[] = [];

    if (maintenanceId) {
      filters.push({
        maintenanceId,
      });
    }

    orderBy.push({
      maintenanceId: 'desc',
    });

    return await db.checklist.findMany({
      orderBy,
      where: {
        AND: filters,
      },
      include: {
        maintenance: true,
        updatedBy: true,
        createdBy: true,
        asset: true,
        task: {
          include: {
            subtask: {
              include: {
                task: true,
              },
            },
            checklist: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateChecklist(
  id: string,
  values: z.infer<typeof UpdateChecklist>,
) {
  try {
    const validatedFields = UpdateChecklist.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    return await db.checklist.update({
      where: { id },
      data: {
        ...validatedFields.data,
        updatedById: validatedFields.data.updatedById,
        updatedOn: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
    } else {
      console.error(error);
    }

    throw error;
  }
}
