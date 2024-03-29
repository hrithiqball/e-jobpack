'use server';

import { revalidatePath } from 'next/cache';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Checklist, Prisma, Task } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

import { Maintenance } from '@/types/maintenance';
import { CreateChecklist, UpdateChecklist } from '@/lib/schemas/checklist';
import { ServerResponseSchema } from '@/lib/schemas/server-response';
import { db } from '@/lib/db';

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

type ExtendedChecklist = Checklist & {
  task: Task[];
};

export async function createChecklist(checklist: CreateChecklist) {
  try {
    const newChecklist = await db.checklist.create({
      data: {
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

export async function createChecklists(
  checklists: {
    assetId: string;
    checklistLibId: string | undefined;
  }[],
  userId: string,
  maintenanceId: string,
) {
  try {
    const newChecklist: ExtendedChecklist[] = [];

    checklists.forEach(async checklist => {
      if (!checklist.checklistLibId) {
        const checklistCreated = await db.checklist.create({
          data: {
            assetId: checklist.assetId,
            maintenanceId,
            createdById: userId,
            updatedById: userId,
          },
          include: {
            task: true,
          },
        });

        newChecklist.push(checklistCreated);
      } else {
        const checklistLibrary = await db.checklistLibrary.findUniqueOrThrow({
          where: {
            id: checklist.checklistLibId,
          },
          include: {
            taskLibrary: true,
          },
        });

        const checklistCreated = await db.checklist.create({
          data: {
            assetId: checklist.assetId,
            maintenanceId,
            createdById: userId,
            updatedById: userId,
            task: {
              createMany: {
                data: checklistLibrary.taskLibrary.map(task => ({
                  id: uuidv4(),
                  taskOrder: task.taskOrder,
                  taskActivity: task.taskActivity,
                  description: task.description,
                  listChoice: task.listChoice,
                  taskType: task.taskType,
                })),
              },
            },
          },
          include: {
            task: true,
          },
        });

        newChecklist.push(checklistCreated);
      }
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

export async function fetchChecklist(id: string) {
  try {
    return await db.checklist.findUniqueOrThrow({
      where: { id },
      include: {
        maintenance: true,
        updatedBy: true,
        createdBy: true,
        asset: true,
        task: true,
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

export async function uploadChecklistImage(
  checklist: Maintenance['checklist'][0],
  formData: FormData,
) {
  try {
    const url = new URL('/maintenance/checklist/upload', baseUrl);

    const response = await (
      await fetch(url, {
        method: 'POST',
        body: formData,
      })
    ).json();

    const validateResponse = ServerResponseSchema.safeParse(response);

    if (!validateResponse.success) {
      throw new Error(validateResponse.error.message);
    }

    const { success, path } = validateResponse.data;

    if (!success) {
      throw new Error('Failed to upload image');
    }

    const attachmentPath = checklist.attachmentPath || [];
    attachmentPath.push(path);

    const updatedChecklist = await db.checklist.update({
      where: { id: checklist.id },
      data: { attachmentPath },
    });

    revalidatePath(`/maintenance/${checklist.maintenanceId}`);
    return updatedChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteChecklist(id: string) {
  try {
    return await db.checklist.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
