'use server';

import { revalidatePath } from 'next/cache';
import { Asset } from '@prisma/client';
import dayjs from 'dayjs';
import z from 'zod';

import { db } from '@/lib/prisma/db';
import { CreateAsset, UpdateAsset } from '@/lib/schemas/asset';
import { ExtendedUser } from '@/types/next-auth';

export async function createAsset(
  values: z.infer<typeof CreateAsset>,
): Promise<Asset> {
  try {
    const validatedFields = CreateAsset.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    if (validatedFields.data.type === '') validatedFields.data.type = null;
    if (validatedFields.data.personInCharge === '')
      validatedFields.data.personInCharge = null;

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
        let personInCharge = null;

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

        if (asset.personInCharge !== null) {
          personInCharge = await db.user.findFirst({
            where: {
              id: asset.personInCharge,
            },
          });
        }

        const createdBy = await db.user.findFirst({
          where: {
            id: asset.createdBy,
          },
        });

        const updatedBy = await db.user.findFirst({
          where: {
            id: asset.updatedBy,
          },
        });

        return {
          ...asset,
          status: status,
          type: type,
          personInCharge: personInCharge,
          createdBy: createdBy,
          updatedBy: updatedBy,
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

export async function updateAsset(
  updatedBy: string,
  id: string,
  values: z.infer<typeof UpdateAsset>,
) {
  try {
    const updatedAsset = await db.asset.update({
      where: {
        id,
      },
      data: {
        updatedBy,
        updatedOn: new Date(),
        ...values,
      },
    });

    revalidatePath('/asset');
    return updatedAsset;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteAsset(actionBy: string, id: string) {
  try {
    await db.history.create({
      data: {
        actionBy,
        activity: `Deleted asset ${id}`,
      },
    });

    await db.asset.delete({
      where: {
        id,
      },
    });

    revalidatePath('/asset');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
