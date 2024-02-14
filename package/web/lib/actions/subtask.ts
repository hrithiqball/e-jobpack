'use server';

import { Prisma, Subtask } from '@prisma/client';

import { db } from '@/lib/db';
import { z } from 'zod';
import { UpdateSubtask } from '@/lib/schemas/subtask';

export async function fetchSubtaskListByTaskUid(
  taskId?: string,
): Promise<Subtask[]> {
  try {
    const filters: Prisma.SubtaskWhereInput[] = [];
    const orderBy: Prisma.SubtaskOrderByWithRelationInput[] = [];

    if (taskId) {
      filters.push({
        taskId,
      });
    }

    orderBy.push({
      taskOrder: 'asc',
    });

    return await db.subtask.findMany({
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

export async function updateSubtask(
  id: string,
  values: z.infer<typeof UpdateSubtask>,
) {
  try {
    return await db.subtask.update({
      where: { id },
      data: {
        ...values,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
