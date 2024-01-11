'use server';

import bcrypt from 'bcryptjs';

import { db } from '@/lib/prisma/db';

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const hash = await bcrypt.hash(password, 10);

    return await db.user.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        name,
        email,
        password: hash,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
