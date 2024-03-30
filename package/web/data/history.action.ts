'use server';

import { db } from '@/lib/db';

export async function getHistories() {
  try {
    return await db.history.findMany({
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
