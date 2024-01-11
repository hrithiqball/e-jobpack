import { db } from '@/lib/prisma/db';

export async function getAccountByUserId(id: string) {
  try {
    return await db.account.findFirst({
      where: { user_id: id },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
