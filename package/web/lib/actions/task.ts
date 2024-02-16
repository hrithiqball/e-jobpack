'use server';

import { Prisma, Task, TaskType } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

import { db } from '@/lib/db';
import { CreateTask, UpdateTask } from '@/lib/schemas/task';

export async function createTask(
  value: z.infer<typeof CreateTask>,
  taskType: TaskType,
) {
  try {
    const filters: Prisma.TaskWhereInput[] = [
      { checklistId: value.checklistId },
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

    let taskOrder: number;

    if (tasks.length === 0) {
      taskOrder = 1;
    } else {
      taskOrder = tasks.length + 1;
    }

    return await db.task.create({
      data: {
        id: `TSK-${dayjs().format('YYMMDDHHmmssSSS')}`,
        taskOrder,
        taskType,
        ...value,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchTaskList(checklistId?: string) {
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

    const taskList = await db.task.findMany({
      orderBy,
      where: {
        AND: filters,
      },
      include: {
        subtask: true,
      },
    });

    return taskList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTask(
  id: string,
  updatedBy: string,
  values: z.infer<typeof UpdateTask>,
) {
  try {
    return await db.task.update({
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

export async function deleteTask(actionBy: string, id: string) {
  try {
    const target = await db.task.delete({
      where: { id },
    });

    await db.history.create({
      data: {
        actionBy,
        activity: `Remove task from checklist ${target.checklistId}`,
        historyMeta: 'MAINTENANCE',
        metaValue: target.id,
      },
    });

    const tasksToReorder = await db.task.findMany({
      where: {
        checklistId: target.checklistId,
        taskOrder: {
          gt: target.taskOrder,
        },
      },
      orderBy: {
        taskOrder: 'asc',
      },
    });

    for (const task of tasksToReorder) {
      await db.task.update({
        where: { id: task.id },
        data: {
          taskOrder: task.taskOrder - 1,
        },
      });
    }

    return target;
  } catch (error) {
    console.error(error);
    throw error;
  }
}