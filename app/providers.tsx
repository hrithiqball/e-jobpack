'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';

import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
