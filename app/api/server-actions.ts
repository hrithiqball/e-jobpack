'use server';

import {
  Prisma,
  Asset,
  AssetStatus,
  AssetType,
  Checklist,
  Maintenance,
  Subtask,
  Task,
} from '@prisma/client';
import { UpdateTask } from '@/app/api/task/[uid]/route';
import { UpdateSubtask } from '@/app/api/subtask/[uid]/route';
import { prisma } from '@/prisma/prisma';
import moment from 'moment';
import bcrypt from 'bcryptjs';

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

export async function createAsset(data: Asset): Promise<Asset> {
  try {
    return await prisma.asset.create({
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAssetList(): Promise<Asset[]> {
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

export async function fetchAsset(assetId: string): Promise<Asset> {
  try {
    return await prisma.asset.findUniqueOrThrow({
      where: {
        uid: assetId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
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

export async function fetchAssetTypeList(): Promise<AssetType[]> {
  try {
    return await prisma.assetType.findMany({
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

export async function fetchAssetStatusList(): Promise<AssetStatus[]> {
  try {
    return await prisma.assetStatus.findMany({
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

export async function createMaintenance(data: Maintenance) {
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
): Promise<Maintenance[]> {
  try {
    const filters: Prisma.MaintenanceWhereInput[] = [];
    const orderBy: Prisma.MaintenanceOrderByWithRelationInput[] = [];

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

export async function createChecklist(data: Checklist) {
  try {
    const newChecklist: Checklist = await prisma.checklist.create({
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
    const filters: Prisma.ChecklistWhereInput[] = [];
    const orderBy: Prisma.ChecklistOrderByWithRelationInput[] = [];

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
    return await prisma.checklistUse.findMany({
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
    return await prisma.checklistLibrary.findMany();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// task

export async function createTask(task: Task): Promise<Task | null> {
  try {
    const filters: Prisma.TaskWhereInput[] = [
      { checklist_uid: task.checklist_uid },
    ];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [
      { task_order: 'desc' },
    ];

    const tasks: Task[] = await prisma.task.findMany({
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
export async function fetchTaskList(checklist_uid?: string): Promise<Task[]> {
  try {
    const filters: Prisma.TaskWhereInput[] = [];
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [];

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
): Promise<Subtask[]> {
  try {
    const filters: Prisma.SubtaskWhereInput[] = [];
    const orderBy: Prisma.SubtaskOrderByWithRelationInput[] = [];

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
