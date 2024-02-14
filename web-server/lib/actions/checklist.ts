'use server';

import { Checklist, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { CreateChecklist, UpdateChecklist } from '@/lib/schemas/checklist';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function createChecklist(checklist: CreateChecklist) {
  try {
    const newChecklist: Checklist = await db.checklist.create({
      data: {
        id: `CL-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedById: checklist.createdById,
        ...checklist,
      },
    });

    return newChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchChecklistList(maintenanceId?: string) {
  try {
    const filters: Prisma.ChecklistWhereInput[] = [];
    const orderBy: Prisma.ChecklistOrderByWithRelationInput[] = [];

    if (maintenanceId) {
      filters.push({
        maintenanceId,
      });
    }

    orderBy.push({
      maintenanceId: 'desc',
    });

    return await db.checklist.findMany({
      orderBy,
      where: {
        AND: filters,
      },
      include: {
        maintenance: true,
        updatedBy: true,
        createdBy: true,
        asset: true,
        task: {
          include: {
            subtask: {
              include: {
                task: true,
              },
            },
            checklist: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateChecklist(
  id: string,
  updatedChecklist: UpdateChecklist,
  checklistLibraryId?: string,
) {
  try {
    if (checklistLibraryId) {
      const checklistLibrary = await db.checklistLibrary.findUniqueOrThrow({
        where: {
          id: checklistLibraryId,
        },
        include: {
          taskLibrary: {
            include: {
              subtaskLibrary: true,
            },
          },
        },
      });

      const newChecklist = await db.checklist.update({
        where: { id },
        data: {
          updatedById: updatedChecklist.updatedById,
          updatedOn: new Date(),
          task: {
            deleteMany: {},
          },
        },
      });

      console.log(checklistLibrary.taskLibrary.length);

      checklistLibrary.taskLibrary.forEach(async task => {
        await db.task.create({
          data: {
            id: uuidv4(),
            taskOrder: task.taskOrder,
            taskActivity: task.taskActivity,
            description: task.description,
            listChoice: task.listChoice,
            taskType: task.taskType,
            checklistId: newChecklist.id,
            subtask: {
              createMany: {
                data: task.subtaskLibrary,
              },
            },
          },
        });
      });

      return newChecklist;
    } else {
      return await db.checklist.update({
        where: { id },
        data: {
          ...updatedChecklist,
          updatedById: updatedChecklist.updatedById,
          updatedOn: new Date(),
        },
      });
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error);
    } else {
      console.error(error);
    }

    throw error;
  }
}
