'use server';

import { Prisma, Task } from '@prisma/client';

import { db } from '@/lib/prisma/db';
import { UpdateTask } from '@/app/api/task/[uid]/route';

export async function createTask(task: Task): Promise<Task | null> {
  try {
    const filters: Prisma.TaskWhereInput[] = [
      { checklist_uid: task.checklist_uid },
    ];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [
      { task_order: 'desc' },
    ];

    const tasks: Task[] = await db.task.findMany({
      orderBy: orderBy,
      where: {
        AND: filters,
      },
    });

    if (tasks.length === 0) {
      task.task_order = 1;
    } else {
      task.task_order = tasks[0].task_order + 1;
    }

    return await db.task.create({
      data: task,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchTaskList(checklist_uid?: string): Promise<Task[]> {
  try {
    const filters: Prisma.TaskWhereInput[] = [];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

    orderBy.push({
      task_order: 'asc',
    });

    if (checklist_uid) {
      filters.push({
        checklist_uid,
      });
    }

    return await db.task.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

// TODO: use schema
export async function updateTask(uid: string, data: UpdateTask) {
  try {
    return await db.task.update({
      where: { uid },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTask(uid: string) {
  try {
    return db.task.delete({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
