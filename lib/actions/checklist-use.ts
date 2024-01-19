'use server';

import { ChecklistUse } from '@prisma/client';

import { db } from '@/lib/db';

export async function fetchChecklistUseList(
  id: string,
): Promise<ChecklistUse[]> {
  try {
    return await db.checklistUse.findMany({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
