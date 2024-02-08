'use server';

import { revalidatePath } from 'next/cache';
import { writeFile, access, mkdir } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';

export async function uploadUserImage(userId: string, data: FormData) {
  try {
    const file: File | null = data.get('file') as unknown as File;

    if (!file || !userId) {
      throw new Error('No file found');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const directory = join('public', 'image', 'user', userId);
    const filePath = join(directory, file.name);
    const image = `/image/user/${userId}/${file.name}`;

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
      where: { id: userId },
      data: { image },
    });

    revalidatePath(`/user/${userId}`);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
