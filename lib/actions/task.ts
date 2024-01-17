'use server';

import { Prisma, Task } from '@prisma/client';

import { db } from '@/lib/db';
import { UpdateTask } from '@/app/api/task/[id]/route';

export async function createTask(task: Task): Promise<Task | null> {
  try {
    const filters: Prisma.TaskWhereInput[] = [
      { checklistId: task.checklistId },
    ];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [
      { taskOrder: 'desc' },
    ];

    const tasks: Task[] = await db.task.findMany({
      orderBy: orderBy,
      where: {
        AND: filters,
      },
    });

    if (tasks.length === 0) {
      task.taskOrder = 1;
    } else {
      task.taskOrder = tasks[0].taskOrder + 1;
    }

    return await db.task.create({
      data: task,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchTaskList(checklistId?: string): Promise<Task[]> {
  try {
    const filters: Prisma.TaskWhereInput[] = [];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

    orderBy.push({
      taskOrder: 'asc',
    });

    if (checklistId) {
      filters.push({
        checklistId,
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
export async function updateTask(id: string, data: UpdateTask) {
  try {
    console.log(data);
    return await db.task.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    return db.task.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
