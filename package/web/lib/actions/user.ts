'use server';

import { hash } from 'bcryptjs';

import { db } from '@/lib/db';
import { ServerResponseSchema } from '../schemas/server-response';
import { revalidatePath } from 'next/cache';

export async function createUser(
  name: string,
  email: string,
  unhashedPassword: string,
) {
  try {
    const password = await hash(unhashedPassword, 10);

    return await db.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchUserList() {
  try {
    return await db.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function uploadUserImage(userId: string, formData: FormData) {
  try {
    const url = `${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}/user/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const validateResponse = ServerResponseSchema.safeParse(data);

    if (!validateResponse.success || !validateResponse.data.success) {
      throw new Error('Failed to upload image');
    }

    const image = validateResponse.data.path;

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
