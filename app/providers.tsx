'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemeProvider attribute="class">{children}</NextThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
