import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Asset Management System",
	description: "A digital asset management system solution for your business.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="light">
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
