import { httpBatchLink } from '@trpc/client';

import { appRouter } from '@/app/server';

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.NEXTAUTH_URL ?? '',
    }),
  ],
});
