'use server';

import { db } from '@/lib/db';
import {
  CreateDepartmentTypeFormType,
  UpdateDepartmentTypeFormType,
} from '@/lib/schemas/department-type';

export async function createDepartmentType(
  userId: string,
  data: CreateDepartmentTypeFormType,
) {
  try {
    await db.history.create({
      data: {
        activity: 'create department type',
        historyMeta: 'USER',
        actionBy: userId,
      },
    });

    return await db.departmentEnum.create({
      data: {
        value: data.value,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDepartmentTypes() {
  try {
    return await db.departmentEnum.findMany({
      orderBy: {
        value: 'asc',
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateDepartmentType(
  userId: string,
  id: string,
  data: UpdateDepartmentTypeFormType,
) {
  try {
    await db.history.create({
      data: {
        activity: 'update department type',
        historyMeta: 'USER',
        actionBy: userId,
      },
    });

    return await db.departmentEnum.update({
      where: { id },
      data: {
        value: data.value,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
