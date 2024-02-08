'use server';

import { revalidatePath } from 'next/cache';
import { Asset } from '@prisma/client';
import dayjs from 'dayjs';
import z from 'zod';

import { db } from '@/lib/db';
import {
  CreateAsset,
  CreateAssetSchema,
  UpdateAsset,
} from '@/lib/schemas/asset';

export async function createAsset(values: CreateAsset): Promise<Asset> {
  try {
    const validatedFields = CreateAssetSchema.safeParse(values);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.message);
    }

    if (validatedFields.data.type === '') validatedFields.data.type = null;
    if (validatedFields.data.personInChargeId === '')
      validatedFields.data.personInChargeId = null;

    return await db.asset.create({
      data: {
        id: `AS-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedById: validatedFields.data.createdById,
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
      include: {
        assetStatus: true,
        assetType: true,
        personInCharge: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    revalidatePath('/asset');
    return assetList;
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

export async function fetchMutatedAssetItem(id: string) {
  try {
    const asset = await db.asset.findUniqueOrThrow({
      where: {
        id,
      },
    });

    let status = null;
    let type = null;
    let personInCharge = null;

    if (asset.statusId !== null) {
      status = await db.assetStatus.findFirstOrThrow({
        where: {
          id: asset.statusId,
        },
      });
    }

    if (asset.type !== null) {
      type = await db.assetType.findFirstOrThrow({
        where: {
          id: asset.type,
        },
      });
    }

    if (asset.personInChargeId !== null) {
      personInCharge = await db.user.findFirst({
        where: {
          id: asset.personInChargeId,
        },
      });
    }

    const createdBy = await db.user.findFirstOrThrow({
      where: {
        id: asset.createdById,
      },
    });

    const updatedBy = await db.user.findFirstOrThrow({
      where: {
        id: asset.updatedById,
      },
    });

    return {
      ...asset,
      status,
      type,
      createdBy,
      updatedBy,
      personInCharge,
    };
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
  updatedById: string,
  id: string,
  values: z.infer<typeof UpdateAsset>,
) {
  try {
    const updatedAsset = await db.asset.update({
      where: {
        id,
      },
      data: {
        updatedById,
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
    await db.asset
      .delete({
        where: {
          id,
        },
      })
      .then(async () => {
        await db.history.create({
          data: {
            actionBy,
            activity: `Deleted asset ${id}`,
            historyMeta: 'USER',
            metaValue: actionBy,
          },
        });
      });

    revalidatePath('/asset');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
