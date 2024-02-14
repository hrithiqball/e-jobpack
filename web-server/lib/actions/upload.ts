'use server';

import { revalidatePath } from 'next/cache';
import { writeFile, access, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { AssetItem } from '@/types/asset';

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

export async function uploadAssetImage(
  asset: AssetItem | undefined,
  data: FormData,
) {
  try {
    if (!asset) {
      throw new Error('No assetId found');
    }

    const file: File | null = data.get('file') as unknown as File;

    if (!file || !asset.id) {
      throw new Error('No file found');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const directory = join('public', 'image', 'asset', asset.id);
    console.log('directory', directory);
    const filePath = join(directory, file.name);
    console.log('filePath', filePath);
    const image = `/image/asset/${asset.id}/${file.name}`;

    try {
      await access(directory);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await mkdir(directory, { recursive: true });
      } else {
        console.error(error);
        throw error;
      }
    }
    await writeFile(filePath, buffer);

    const attachmentPath = asset.attachmentPath || [];
    attachmentPath.push(image);

    await db.asset.update({
      where: { id: asset.id },
      data: { attachmentPath },
    });

    revalidatePath(`/asset/${asset.id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
