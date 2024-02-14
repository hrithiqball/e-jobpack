'use server';

import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';

export async function createUser(
  name: string,
  email: string,
  unhashedPassword: string,
) {
  try {
    const password = await bcrypt.hash(unhashedPassword, 10);

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
