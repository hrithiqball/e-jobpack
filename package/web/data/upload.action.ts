'use server';

import { writeFile, access, mkdir } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { AssetItem } from '@/types/asset';
import { db } from '@/lib/db';
import { join } from 'path';
import { ServerResponseSchema } from '../lib/schemas/server-response';

export async function uploadUserImage(id: string, data: FormData) {
  try {
    const file: File | null = data.get('file') as unknown as File;

    if (!file || !id) {
      throw new Error('No file found');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const directory = join('public', 'image', 'user', id);
    const filePath = join(directory, file.name);
    const image = `/image/user/${id}/${file.name}`;

    try {
      await access(directory);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await mkdir(directory, { recursive: true });
      } else {
        throw error;
      }
    }
    await writeFile(filePath, buffer);

    const updatedUser = await db.user.update({
      where: { id },
      data: { image },
    });

    revalidatePath(`/user/${id}`);
    return updatedUser;
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
