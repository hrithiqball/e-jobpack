'use server';

import { db } from '@/lib/db';

export async function getDepartmentTypes() {
  try {
    return await db.departmentEnum.findMany({
      orderBy: {
        value: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
