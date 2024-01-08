'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { reduxStore } from '@/lib/redux';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ReduxProvider store={reduxStore}>
        <NextUIProvider>
          <NextThemeProvider attribute="class">{children}</NextThemeProvider>
        </NextUIProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
