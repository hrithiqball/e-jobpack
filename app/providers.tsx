'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <NextUIProvider>
        <NextThemeProvider attribute="class">{children}</NextThemeProvider>
      </NextUIProvider>
    </ReduxProvider>
  );
}
