'use server';

import { hash } from 'bcryptjs';
import { z } from 'zod';

import { RegisterSchema } from '@/lib/schemas/auth';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await hash(password, 10);

  if (await getUserByEmail(email)) {
    return { error: 'Email already in use!' };
  }

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: 'User created successfully!' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return { error: error.message };
    }
    return { error: 'Something went wrong!' };
  }
}
