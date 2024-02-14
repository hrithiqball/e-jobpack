'use server';

import { revalidatePath } from 'next/cache';
import { Asset } from '@prisma/client';
import dayjs from 'dayjs';
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

export async function fetchAssetItem(id: string) {
  try {
    const asset = await db.asset.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        assetStatus: true,
        assetType: true,
        personInCharge: true,
        createdBy: true,
        updatedBy: true,
      },
    });

    return asset;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateAsset(
  updatedById: string,
  id: string,
  updateAsset: UpdateAsset,
) {
  try {
    await db.asset
      .update({
        where: {
          id,
        },
        data: {
          updatedById,
          updatedOn: new Date(),
          ...updateAsset,
        },
      })
      .then(() => {
        revalidatePath(`/asset/${id}`);
      });
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
