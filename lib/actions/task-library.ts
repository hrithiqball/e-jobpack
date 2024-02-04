'use server';

import { db } from '@/lib/db';
import { CreateTaskLibrary, UpdateTaskLibrary } from '@/lib/schemas/task';

export async function createTaskLibrary(
  userId: string,
  createTaskLibrary: CreateTaskLibrary,
) {
  try {
    return await db.taskLibrary.create({
      data: {
        ...createTaskLibrary,
        createdById: userId,
        updatedById: userId,
        taskOrder: 1,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchTaskLibraryList() {
  try {
    return await db.taskLibrary.findMany({
      include: {
        subtaskLibrary: {
          include: {
            createdBy: true,
            updatedBy: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTaskLibrary(
  userId: string,
  id: string,
  updatedTaskLibrary: UpdateTaskLibrary,
) {
  try {
    const target = await db.taskLibrary.update({
      where: { id },
      data: { ...updatedTaskLibrary, updatedById: userId },
    });

    await db.history.create({
      data: {
        actionBy: userId,
        activity: `Update task ${target.taskActivity} from checklist library ${target.checklistLibraryId}`,
        historyMeta: 'MAINTENANCE',
      },
    });

    return target;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTaskLibrary(userId: string, id: string) {
  try {
    const target = await db.taskLibrary.delete({
      where: { id },
    });

    await db.history.create({
      data: {
        actionBy: userId,
        activity: `Delete task ${target.taskActivity} from checklist library ${target.checklistLibraryId}`,
        historyMeta: 'MAINTENANCE',
      },
    });

    return target;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
