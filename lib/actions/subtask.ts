'use server';

import { Prisma, Subtask } from '@prisma/client';

import { db } from '@/lib/prisma/db';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';

export async function fetchSubtaskListByTaskUid(
  task_uid?: string,
): Promise<Subtask[]> {
  try {
    const filters: Prisma.SubtaskWhereInput[] = [];
    const orderBy: Prisma.SubtaskOrderByWithRelationInput[] = [];

    if (task_uid) {
      filters.push({
        task_uid,
      });
    }

    orderBy.push({
      task_order: 'asc',
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
export async function updateSubtask(uid: string, data: UpdateSubtask) {
  try {
    return await db.subtask.update({
      where: { uid },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
