import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

//
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
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Image
            priority
            src={petronasIcon}
            alt="Petronas Logo"
            className="w-8 mr-3"
          />
          <article className="prose">
            <h3 className="text-emeraldGreenDark">Asset Management System</h3>
          </article>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
      </NavbarContent>

      <NavbarMenu>
        {navLinks.map((item) => {
          const isCurrentPage = pathname === item.href;
          const linkColor = isCurrentPage ? "primary" : "foreground";

          return (
            <NavbarMenuItem key={item.href}>
              <Link
                color={linkColor}
                className="w-full"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
}
