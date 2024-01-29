'use server';

import { db } from '@/lib/db';
import { CreateMaintenanceLibrary } from '@/lib/schemas/maintenance';

export async function createMaintenanceLibrary(
  maintenanceLibrary: CreateMaintenanceLibrary,
) {
  try {
    const newMaintenanceLibrary = await db.maintenanceLibrary.create({
      data: {
        title: maintenanceLibrary.title,
        description: maintenanceLibrary.description,
        createdById: maintenanceLibrary.createdById,
        updatedById: maintenanceLibrary.updatedById,
      },
    });

    maintenanceLibrary.checklistLibrary.forEach(async checklist => {
      const newChecklistLib = await db.checklistLibrary.create({
        data: {
          title: checklist.title,
          description: checklist.description,
          createdById: checklist.createdById,
          updatedById: checklist.updatedById,
          maintenanceLibraryId: newMaintenanceLibrary.id,
        },
      });

      checklist.taskLibrary.forEach(async task => {
        await db.taskLibrary.create({
          data: {
            taskActivity: task.taskActivity,
            description: task.description,
            listChoice: task.listChoice,
            taskType: task.taskType,
            createdById: task.createdById,
            updatedById: task.updatedById,
            checklistLibraryId: newChecklistLib.id,
            subtaskLibrary: {
              createMany: {
                data: task.subtaskLibrary,
              },
            },
          },
        });
      });
    });

    return newMaintenanceLibrary;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceLibraryList() {
  try {
    return await db.maintenanceLibrary.findMany({
      orderBy: {
        title: 'asc',
      },
      include: {
        createdBy: true,
        updatedBy: true,
        checklistLibrary: {
          include: {
            createdBy: true,
            updatedBy: true,
            asset: true,
            taskLibrary: {
              orderBy: { taskActivity: 'asc' },
              include: {
                createdBy: true,
                updatedBy: true,
                subtaskLibrary: {
                  orderBy: { taskActivity: 'asc' },
                  include: {
                    createdBy: true,
                    updatedBy: true,
                  },
                },
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
