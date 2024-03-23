'use server';

import { db } from '@/lib/db';

export async function createAssetType(userId: string, title: string) {
  try {
    return await db.assetType.create({
      data: {
        createdById: userId,
        updatedById: userId,
        title,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAssetTypeList() {
  try {
    return await db.assetType.findMany({
      orderBy: {
        title: 'asc',
      },
      include: {
        asset: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
