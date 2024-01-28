'use server';

import dayjs from 'dayjs';

import { db } from '@/lib/db';
import { CreateSubtaskLibrary } from '@/lib/schemas/subtask';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import { CreateChecklistLibrary } from '@/lib/schemas/checklist';

export async function fetchChecklistLibraryList() {
  try {
    return await db.checklistLibrary.findMany();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createChecklistLibrary(
  userId: string,
  checklist: CreateChecklistLibrary,
  taskList: CreateTaskLibrary[],
  subtaskList: CreateSubtaskLibrary[],
) {
  try {
    const newChecklistLibrary = await db.checklistLibrary.create({
      data: {
        id: `CL_LIB-${dayjs().format('YYYYMMDDHHmmssSSS')}`,
        title: checklist.title,
        description: checklist.description,
        createdById: userId,
        updatedById: userId,
      },
    });

    await db.taskLibrary.createMany({
      data: taskList.map(task => ({
        ...task,
        checklistLibraryId: newChecklistLibrary.id,
        createdById: userId,
        updatedById: userId,
      })),
    });

    await db.taskLibrary.createMany({
      data: subtaskList.map(subtask => ({
        ...subtask,
        createdById: userId,
        updatedById: userId,
      })),
    });

    await db.subtaskLibrary.createMany({
      data: subtaskList.map(subtask => ({
        ...subtask,
        taskLibraryId: newChecklistLibrary.id,
        createdById: userId,
        updatedById: userId,
      })),
    });

    return newChecklistLibrary;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
