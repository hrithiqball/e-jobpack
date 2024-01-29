'use server';

import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { CreateSubtaskLibrary } from '@/lib/schemas/subtask';
import { CreateTaskLibrary } from '@/lib/schemas/task';
import { CreateChecklistLibrary } from '@/lib/schemas/checklist';
import { TaskType } from '@prisma/client';

type TaskLibrary = {
  checklistLibraryId: string;
  taskActivity: string;
  taskType: TaskType;
  description?: string | null | undefined;
  listChoice?: string[] | undefined;
  id: string;
  createdById: string;
  updatedById: string;
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
};

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
            }) satisfies SubtaskLibrary,
        );

      modifiedTaskList.push(newTask);
      modifiedSubtaskList.push(...subtasks);
    });

    await db.taskLibrary.createMany({
      data: modifiedTaskList,
    });

    await db.taskLibrary.createMany({
      data: modifiedSubtaskList.map(subtask => ({
        id: uuidv4(),
        taskActivity: subtask.taskActivity,
        taskType: subtask.taskType,
        description: subtask.description,
        listChoice: subtask.listChoice,
        createdById: userId,
        updatedById: userId,
      })),
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
