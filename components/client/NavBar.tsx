'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import clientIcon from '@/public/image/client-icon.svg';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  DropdownTrigger,
  DropdownMenu,
  Dropdown,
  DropdownItem,
} from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { CircleUserRound, Moon, Sun } from 'lucide-react';

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/asset', label: 'Asset' },
    { href: '/task', label: 'Task' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar
      disableAnimation={true}
      onMenuOpenChange={setIsMenuOpen}
      className="flex relative w-full items-center justify-between"
      maxWidth="full"
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="pr-8 sm:hidden"
        />
        <NavbarBrand>
          <Image
            priority
            src={clientIcon}
            alt="Petronas Logo"
            className="w-6 mr-3"
          />
          <p className="font-bold text-inherit">eJobpack</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navLinks.map(link => {
          const isCurrentPage =
            pathname === link.href || pathname.startsWith(link.href);
          const ariaProps: { 'aria-current'?: 'page' } = isCurrentPage
            ? { 'aria-current': 'page' }
            : {};

          return (
            <NavbarItem key={link.href} isActive={isCurrentPage}>
              <Link
                color={isCurrentPage ? 'primary' : 'foreground'}
                href={link.href}
                {...ariaProps}
              >
                {link.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          isIconOnly
          size="sm"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="ghost"
              size="sm"
              startContent={<CircleUserRound size={18} />}
            >
              {session?.user?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="real-name">{session?.user?.name}</DropdownItem>
            <DropdownItem key="profile">{session?.user?.email}</DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem color="danger" key="real" onClick={() => signOut()}>
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {navLinks.map(item => {
          const isCurrentPage = pathname === item.href;
          const linkColor = isCurrentPage ? 'primary' : 'foreground';

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
