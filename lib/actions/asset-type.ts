'use server';

import { AssetType } from '@prisma/client';

import { db } from '@/lib/db';

export async function fetchAssetTypeList(): Promise<AssetType[]> {
  try {
    return await db.assetType.findMany({
      orderBy: {
        updatedOn: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
