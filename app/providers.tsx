// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import TanStackProvider from "./components/providers/TanStackProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider>
			<TanStackProvider>
				<NextThemeProvider attribute="class">{children}</NextThemeProvider>
			</TanStackProvider>
		</NextUIProvider>
	);
}
