'use client';

import { PropsWithChildren } from 'react';

import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import TrpcProvider from '@/app/_trpc/TrpcProvider';

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <TrpcProvider>
        <NextUIProvider>
          <ThemeProvider attribute="class">{children}</ThemeProvider>
        </NextUIProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}
