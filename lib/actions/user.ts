'use server';

import bcrypt from 'bcryptjs';
import moment from 'moment';

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
        id: `USER-${moment().format('YYMMDDHHmmssSSS')}`,
        first_page: 0,
        enable_dashboard: true,
        is_dark_mode: true,
        created_at: new Date(),
        updated_at: new Date(),
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
