'use client';

import { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';

import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
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
