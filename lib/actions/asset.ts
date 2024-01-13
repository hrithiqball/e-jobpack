'use server';

import { revalidatePath } from 'next/cache';
import { Asset } from '@prisma/client';
import dayjs from 'dayjs';
import z from 'zod';

import { db } from '@/lib/prisma/db';
import { CreateAsset } from '@/lib/schemas/asset';

export async function createAsset(
  values: z.infer<typeof CreateAsset>,
): Promise<Asset> {
  try {
    const validatedFields = CreateAsset.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    if (validatedFields.data.type === '') validatedFields.data.type = null;

    return await db.asset.create({
      data: {
        id: `AS-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedBy: validatedFields.data.createdBy,
        ...validatedFields.data,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAssetList() {
  try {
    const assetList = await db.asset.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    revalidatePath('/asset');
    return assetList;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchMutatedAssetList() {
  try {
    const assetList = await db.asset.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const mutatedAssetList = await Promise.all(
      assetList.map(async asset => {
        let status = null;
        let type = null;

        if (asset.statusId !== null) {
          status = await db.assetStatus.findFirst({
            where: {
              id: asset.statusId,
            },
          });
        }

        if (asset.type !== null) {
          type = await db.assetType.findFirst({
            where: {
              id: asset.type,
            },
          });
        }

        return {
          ...asset,
          status: status,
          type: type,
        };
      }),
    );

    revalidatePath('/asset');
    return mutatedAssetList;
  } catch (error) {
    console.error(error);
    throw error;
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
