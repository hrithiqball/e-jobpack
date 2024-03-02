'use server';

import { db } from '@/lib/db';

export async function assignTask(
  taskId: string,
  userCheck: { userId: string; checked: boolean }[],
) {
  try {
    const deleteTarget: string[] = [];

    for (const uc of userCheck.filter(uc => !uc.checked)) {
      const record = await db.taskAssignee.findUnique({
        where: { taskId_userId: { taskId, userId: uc.userId } },
      });

      if (record) {
        deleteTarget.push(record.userId);
      }
    }

    const removeOperations = deleteTarget.map(userId =>
      db.taskAssignee.delete({
        where: { taskId_userId: { taskId, userId } },
      }),
    );

    const upsertOperations = userCheck
      .filter(uc => uc.checked)
      .map(uc =>
        db.taskAssignee.upsert({
          where: { taskId_userId: { taskId, userId: uc.userId } },
          update: { userId: uc.userId },
          create: { taskId, userId: uc.userId },
        }),
      );

    const allOperations = [...removeOperations, ...upsertOperations];
    await Promise.all(allOperations);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
