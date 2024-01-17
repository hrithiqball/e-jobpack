'use server';

import { ChecklistLibrary } from '@prisma/client';

import { db } from '@/lib/db';

export async function fetchChecklistLibraryList(): Promise<ChecklistLibrary[]> {
  try {
    return await db.checklistLibrary.findMany();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
