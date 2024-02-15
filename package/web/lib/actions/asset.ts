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
import { AssetItem } from '@/types/asset';
import { ServerResponseSchema } from '@/lib/schemas/server-response';

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

export async function uploadAssetImage(asset: AssetItem, formData: FormData) {
  try {
    const url = `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/asset/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const validatedResponse = ServerResponseSchema.safeParse(data);

    if (!validatedResponse.success || !validatedResponse.data.success) {
      throw new Error('Failed to upload image');
    }

    const attachmentPath = asset.attachmentPath || [];
    attachmentPath.push(validatedResponse.data.path);

    const updatedAsset = await db.asset.update({
      where: { id: asset.id },
      data: { attachmentPath },
    });

    revalidatePath(`/asset/${asset.id}`);
    return updatedAsset;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
