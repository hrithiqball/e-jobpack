import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';

import { db } from '@/lib/prisma/db';
import { CreateAsset } from '@/lib/schemas/asset';
import { procedure, router } from '@/app/server/trpc';

export const appRouter = router({
  getAssets: procedure.query(async () => {
    // TODO: get asset list from server actions
    const assetList = await db.asset.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const assetListWithStatus = await Promise.all(
      assetList.map(async asset => {
        let status = null;
        let type = null;

        if (asset.statusId !== null) {
          status = await db.assetStatus.findFirst({
            where: {
              id: asset.statusId,
            },
          });
        }

        if (asset.type !== null) {
          type = await db.assetType.findFirst({
            where: {
              id: asset.type,
            },
          });
        }

        return {
          ...asset,
          status: status,
          type: type,
        };
      }),
    );

    revalidatePath('/asset');
    return assetListWithStatus;
  }),
  createAsset: procedure.input(CreateAsset).mutation(async opts => {
    return await db.asset.create({
      data: {
        id: `AS-${dayjs().format('YYMMDDHHmmssSSS')}`,
        updatedBy: opts.input.createdBy,
        type: opts.input.type === '' ? null : opts.input.type,
        ...opts.input,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
