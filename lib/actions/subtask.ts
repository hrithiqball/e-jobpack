'use server';

import { Prisma, Subtask } from '@prisma/client';

import { db } from '@/lib/prisma/db';
import { UpdateSubtask } from '@/app/api/subtask/[id]/route';

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

// TODO: use schema
export async function updateSubtask(id: string, data: UpdateSubtask) {
  try {
    return await db.subtask.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
