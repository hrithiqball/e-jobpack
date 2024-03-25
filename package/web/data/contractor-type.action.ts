'use server';

import { db } from '@/lib/db';

export async function getContactorTypes() {
  try {
    return await db.contractorType.findMany({
      orderBy: {
        createdOn: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
