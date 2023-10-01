import React from "react";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	Button,
	Avatar,
	NavbarMenu,
	NavbarMenuItem,
	Link,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import petronasIcon from "../../public/petronas.svg";

export default function Nav() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();
	const navLinks = [
		{ href: "/dashboard", label: "Dashboard" },
		{ href: "/asset-page", label: "Asset" },
	];

	return (
		<Navbar
			disableAnimation={true}
			onMenuOpenChange={setIsMenuOpen}
			isBordered
			className="flex items-center justify-between p-1"
		>
			{/* <NavbarBrand>
				<Image
					priority
					src={petronasIcon}
					alt="Petronas Logo"
					className="w-8 mr-3"
				/>
				<p className="font-bold text-inherit">ACME</p>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				<NavbarItem>
					<Link color="foreground" href="#">
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link href="#" aria-current="page">
						Customers
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Integrations
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem className="hidden lg:flex">
					<Link href="#">Login</Link>
				</NavbarItem>
				<NavbarItem>
					<Button as={Link} color="primary" href="#" variant="flat">
						Sign Up
					</Button>
				</NavbarItem>
			</NavbarContent> */}
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
			</NavbarContent>

			<NavbarBrand>
				<Image
					priority
					src={petronasIcon}
					alt="Petronas Logo"
					className="w-5 mr-3"
				/>
				<p className="font-bold text-inherit text-emeraldGreenDark">
					Asset Management System
				</p>
			</NavbarBrand>

			<NavbarContent>
				<div className="hidden sm:flex gap-4">
					{navLinks.map((link) => {
						const isCurrentPage = pathname === link.href;
						const ariaProps: { "aria-current"?: "page" } = isCurrentPage
							? { "aria-current": "page" }
							: {};

						return (
							<NavbarItem key={link.href} isActive={isCurrentPage}>
								<Link color="foreground" href={link.href} {...ariaProps}>
									{link.label}
								</Link>
							</NavbarItem>
						);
					})}
				</div>
			</NavbarContent>

			<NavbarContent>
				<Button variant="ghost" size="sm">
					<Avatar size="sm" src="/profile-image.png" alt="Profile" />
				</Button>
			</NavbarContent>
		</Navbar>
		// <Navbar
		// 	disableAnimation={true}
		// 	onMenuOpenChange={setIsMenuOpen}
		// 	isBordered
		// 	classNames={{
		// 		item: [
		// 			"flex",
		// 			"relative",
		// 			"h-full",
		// 			"items-center",
		// 			"data-[active=true]:after:content-['']",
		// 			"data-[active=true]:after:absolute",
		// 			"data-[active=true]:after:bottom-0",
		// 			"data-[active=true]:after:left-0",
		// 			"data-[active=true]:after:right-0",
		// 			"data-[active=true]:after:h-[2px]",
		// 			"data-[active=true]:after:rounded-[2px]",
		// 			"data-[active=true]:after:bg-primary",
		// 		],
		// 	}}
		// >
		// 	<NavbarContent>
		// 		<NavbarMenuToggle
		// 			aria-label={isMenuOpen ? "Close menu" : "Open menu"}
		// 			// className="sm:hidden"
		// 		/>
		// 		<NavbarBrand>
		// 			<Image
		// 				priority
		// 				src={petronasIcon}
		// 				alt="Petronas Logo"
		// 				className="w-8 mr-3"
		// 			/>
		// 			<article className="prose">
		// 				<h3 className="text-emeraldGreenDark">Asset Management System</h3>
		// 			</article>
		// 		</NavbarBrand>
		// 	</NavbarContent>

		// 	<NavbarContent className="hidden sm:flex gap-4" justify="start">
		// 		{navLinks.map((link) => {
		// 			const isCurrentPage = pathname === link.href;
		// 			const ariaProps: { "aria-current"?: "page" } = isCurrentPage
		// 				? { "aria-current": "page" }
		// 				: {};

		// 			return (
		// 				<NavbarItem key={link.href} isActive={isCurrentPage}>
		// 					<Link color="foreground" href={link.href} {...ariaProps}>
		// 						{link.label}
		// 					</Link>
		// 				</NavbarItem>
		// 			);
		// 		})}
		// 	</NavbarContent>

		// 	<NavbarMenu>
		// 		{navLinks.map((item) => {
		// 			const isCurrentPage = pathname === item.href;
		// 			const linkColor = isCurrentPage ? "primary" : "foreground";

		// 			return (
		// 				<NavbarMenuItem key={item.href}>
		// 					<Link
		// 						color={linkColor}
		// 						className="w-full"
		// 						href={item.href}
		// 						size="lg"
		// 					>
		// 						{item.label}
		// 					</Link>
		// 				</NavbarMenuItem>
		// 			);
		// 		})}
		// 	</NavbarMenu>
		// </Navbar>
	);
}
