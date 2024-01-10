import { db } from '@/lib/db';

export async function getAccountByUserId(userId: string) {
  try {
    return await db.account.findFirst({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
