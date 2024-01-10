'use server';

import { ChecklistUse } from '@prisma/client';

import { db } from '@/lib/prisma/db';

export async function fetchChecklistUseList(
  uid: string,
): Promise<ChecklistUse[]> {
  try {
    return await db.checklistUse.findMany({
      where: { uid },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
