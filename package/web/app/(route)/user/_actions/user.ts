'use server';

import { db } from '@/lib/db';

export async function fetchUser(id: string) {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error('error', error);
    throw error;
  }
}
