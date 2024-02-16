'use server';

import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

import {
  ResultSchema,
  ServerResponseSchema,
} from '@/lib/schemas/server-response';

const baseServerUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

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
    const url = `${baseServerUrl}/user/upload`;

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

export async function deleteUserImage(userId: string) {
  try {
    const userImage = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { image: true },
    });

    if (!userImage.image) {
      throw new Error('User does not have an image');
    }

    const url = new URL('/user/delete', baseServerUrl);
    url.searchParams.append('filename', userImage.image);

    const response = await fetch(url, {
      method: 'DELETE',
    });

    const data = await response.json();

    const validateResponse = ResultSchema.safeParse(data);

    if (!validateResponse.success) {
      throw new Error(validateResponse.error.message);
    }

    const { success, message } = validateResponse.data;

    if (!success) {
      console.error(message);
      throw new Error(message);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { image: null },
    });

    revalidatePath(`/user/${userId}`);
    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
