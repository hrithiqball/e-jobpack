'use server';

import z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { User } from '@prisma/client';

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (await getUserByEmail(email)) {
    return { error: 'Email already in use!' };
  }

  const data: User = {
    id: email,
    name,
    email,
    password: hashedPassword,
    first_page: 0,
    enable_dashboard: true,
    is_dark_mode: true,
    created_at: new Date(),
    updated_at: new Date(),
    role: 'admin',
    email_verified: null,
    department: 'management',
    image: null,
  };

  await db.user.create({ data });

  return { success: 'User created successfully!' };
}
