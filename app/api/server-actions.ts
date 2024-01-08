'use server';

import {
  Prisma,
  asset,
  asset_status,
  asset_type,
  checklist,
  maintenance,
  subtask,
  task,
} from '@prisma/client';
import { UpdateTask } from '@/app/api/task/[uid]/route';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';
import { prisma } from '@/prisma/prisma';
import moment from 'moment';
import bcrypt from 'bcrypt';

// user

export async function fetchUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createNewUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const hash = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        id: `USER-${moment().format('YYMMDDHHmmssSSS')}`,
        first_page: 0,
        enable_dashboard: true,
        is_dark_mode: true,
        created_at: new Date(),
        updated_at: new Date(),
        name,
        email,
        password: hash,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// asset

export async function createAsset(data: asset): Promise<asset> {
  try {
    return await prisma.asset.create({
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAssetList(): Promise<asset[]> {
  try {
    return await prisma.asset.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchFilteredAssetList(assetIds: string[]) {
  try {
    return await prisma.asset.findMany({
      where: {
        uid: {
          in: assetIds,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// asset type

export async function fetchAssetTypeList(): Promise<asset_type[]> {
  try {
    return await prisma.asset_type.findMany({
      orderBy: {
        updated_on: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// asset status

export async function fetchAssetStatusList(): Promise<asset_status[]> {
  try {
    return await prisma.asset_status.findMany({
      orderBy: {
        title: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// maintenance

export async function createMaintenance(data: maintenance) {
  try {
    return await prisma.maintenance.create({
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceItemById(uid: string) {
  try {
    return await prisma.maintenance.findUnique({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchMaintenanceList(
  assetUid?: string,
): Promise<maintenance[]> {
  try {
    const filters: Prisma.maintenanceWhereInput[] = [];
    const orderBy: Prisma.maintenanceOrderByWithRelationInput[] = [];

    if (assetUid) {
      filters.push({
        asset_uid: assetUid,
      });
    }

    orderBy.push({
      date: 'desc',
    });

    return await prisma.maintenance.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist

export async function createChecklist(data: checklist) {
  try {
    const newChecklist: checklist = await prisma.checklist.create({
      data,
    });

    return newChecklist;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchChecklistList(maintenance_uid?: string) {
  try {
    const filters: Prisma.checklistWhereInput[] = [];
    const orderBy: Prisma.checklistOrderByWithRelationInput[] = [];

    if (maintenance_uid) {
      filters.push({
        maintenance_uid,
      });
    }

    orderBy.push({
      title: 'asc',
    });

    return await prisma.checklist.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist use

/**
 * fetch checklist use by asset
 * @param assetUid
 * @returns item of checklist
 */
export async function fetchChecklistUseList(uid: string) {
  try {
    return await prisma.checklist_use.findMany({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// checklist library

export async function fetchChecklistLibraryList() {
  try {
    return await prisma.checklist_library.findMany();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// task

export async function createTask(task: task): Promise<task | null> {
  try {
    const filters: Prisma.taskWhereInput[] = [
      { checklist_uid: task.checklist_uid },
    ];
    const orderBy: Prisma.taskOrderByWithRelationInput[] = [
      { task_order: 'desc' },
    ];

    const tasks: task[] = await prisma.task.findMany({
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

    return await prisma.task.create({
      data: task,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * fetch task list
 * @returns @type {Result<task[]>} of task list
 */
export async function fetchTaskList(checklist_uid?: string): Promise<task[]> {
  try {
    const filters: Prisma.taskWhereInput[] = [];
    const orderBy: Prisma.taskOrderByWithRelationInput[] = [];

    orderBy.push({
      task_order: 'asc',
    });

    if (checklist_uid) {
      filters.push({
        checklist_uid,
      });
    }

    return await prisma.task.findMany({
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

export async function updateTask(uid: string, data: UpdateTask) {
  try {
    return await prisma.task.update({
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
    return prisma.task.delete({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// subtask

/**
 * fetch subtask list
 * @param task_uid
 * @returns @type {Result<subtask[]>} of subtask list
 */
export async function fetchSubtaskListByTaskUid(
  task_uid?: string,
): Promise<subtask[]> {
  try {
    const filters: Prisma.subtaskWhereInput[] = [];
    const orderBy: Prisma.subtaskOrderByWithRelationInput[] = [];

    if (task_uid) {
      filters.push({
        task_uid,
      });
    }

    orderBy.push({
      task_order: 'asc',
    });

    return await prisma.subtask.findMany({
      orderBy,
      where: {
        AND: filters,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSubtask(uid: string, data: UpdateSubtask) {
  try {
    return await prisma.subtask.update({
      where: { uid },
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
