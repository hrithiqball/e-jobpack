import { db } from '@/lib/prisma/db';

export async function getAccountByUserId(userId: string) {
  try {
    return await db.account.findFirst({
      where: { userId },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
