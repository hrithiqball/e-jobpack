'use server';

import { AssetType } from '@prisma/client';

import { db } from '@/lib/prisma/db';

export async function fetchAssetTypeList(): Promise<AssetType[]> {
  try {
    return await db.assetType.findMany({
      orderBy: {
        updated_on: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}