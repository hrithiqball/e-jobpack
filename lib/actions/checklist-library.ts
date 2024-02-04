'use server';

import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { CreateSubtaskLibrary } from '@/lib/schemas/subtask';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import { CreateChecklistLibrary } from '@/lib/schemas/checklist';
import { Prisma, TaskType } from '@prisma/client';

type TaskLibrary = {
  checklistLibraryId: string;
  taskActivity: string;
  taskType: TaskType;
  description?: string | null | undefined;
  listChoice?: string[] | undefined;
  id: string;
  createdById: string;
  updatedById: string;
  taskOrder: number;
};

type SubtaskLibrary = {
  taskId: string;
  taskActivity: string;
  taskType: TaskType;
  description?: string | null | undefined;
  listChoice?: string[] | undefined;
  id: string;
  createdById: string;
  updatedById: string;
  taskOrder: number;
};

export async function fetchChecklistLibraryList(assetId?: string) {
  try {
    const filters: Prisma.ChecklistLibraryWhereInput[] = [];

    if (assetId) {
      filters.push({ assetId });
    }

    return await db.checklistLibrary.findMany({
      where: {
        AND: filters,
      },
      include: {
        asset: true,
        createdBy: true,
        updatedBy: true,
        taskLibrary: {
          orderBy: {
            taskOrder: 'asc',
          },
          include: {
            subtaskLibrary: {
              orderBy: {
                taskOrder: 'asc',
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createChecklistLibrary(
  userId: string,
  assetId: string,
  checklist: CreateChecklistLibrary,
  taskList: CreateTaskLibrary[],
  subtaskList: CreateSubtaskLibrary[],
) {
  try {
    const modifiedTaskList: TaskLibrary[] = [];
    const modifiedSubtaskList: SubtaskLibrary[] = [];

    const newChecklistLibrary = await db.checklistLibrary.create({
      data: {
        id: `CL_LIB-${dayjs().format('YYYYMMDDHHmmssSSS')}`,
        title: checklist.title,
        description: checklist.description,
        createdById: userId,
        updatedById: userId,
        assetId,
      },
    });

    taskList.forEach(task => {
      const newTask = {
        ...task,
        checklistLibraryId: newChecklistLibrary.id,
        id: uuidv4(),
        createdById: userId,
        updatedById: userId,
        taskOrder: task.taskOrder ?? 1,
      } satisfies TaskLibrary;

      const subtasks = subtaskList
        .filter(subtask => subtask.taskId === task.id)
        .map(
          subtask =>
            ({
              ...subtask,
              id: uuidv4(),
              taskId: newTask.id,
              createdById: userId,
              updatedById: userId,
              taskOrder: subtask.taskOrder ?? 1,
            }) satisfies SubtaskLibrary,
        );

      modifiedTaskList.push(newTask);
      modifiedSubtaskList.push(...subtasks);
    });

    await db.taskLibrary.createMany({
      data: modifiedTaskList,
    });

    await db.subtaskLibrary.createMany({
      data: modifiedSubtaskList,
    });

    return newChecklistLibrary;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteChecklistLibrary(userId: string, id: string) {
  try {
    const checklistLibrary = await db.checklistLibrary.delete({
      where: { id },
    });

    await db.history.create({
      data: {
        actionBy: userId,
        activity: `Delete ${checklistLibrary.title} from checklist library`,
        historyMeta: 'MAINTENANCE',
      },
    });

    return checklistLibrary;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
