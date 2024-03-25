'use server';

import { db } from '@/lib/db';

export async function getContractors() {
  try {
    return await db.contractor.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        contractorType: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
