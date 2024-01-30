'use server';

import { db } from '@/lib/db';

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
