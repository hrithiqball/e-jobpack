import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
// import Navigation from "@/components/Navigation";
// import { ReadUserInfo } from "@/utils/actions/route";
// import SignOutItem from "@/components/SignOutItem";

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
	// const userInfo = await ReadUserInfo();

	return (
		<html lang="en" className="light">
			<body className={inter.className}>
				{/* <header>
					{userInfo && (
						<Navigation user={userInfo}>
							<SignOutItem />
						</Navigation>
					)}
				</header> */}
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
