'use server';

import { AssetStatus } from '@prisma/client';

import { db } from '@/lib/db';

export async function fetchAssetStatusList(): Promise<AssetStatus[]> {
  try {
    return await db.assetStatus.findMany({
      orderBy: {
        title: 'desc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
