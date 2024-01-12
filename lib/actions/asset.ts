'use server';

import { Asset } from '@prisma/client';

import { db } from '@/lib/prisma/db';

export async function createAsset(data: Asset): Promise<Asset> {
  try {
    return await db.asset.create({
      data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAssetList(): Promise<Asset[]> {
  try {
    return await db.asset.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchAssetItem(id: string): Promise<Asset> {
  try {
    return await db.asset.findUniqueOrThrow({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchFilteredAssetList(assetIds: string[]) {
  try {
    return await db.asset.findMany({
      where: {
        id: {
          in: assetIds,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
