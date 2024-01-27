'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
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
import { CircleUserRound, DoorOpen, Moon, Sun } from 'lucide-react';

import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { logout } from '@/lib/actions/logout';
import clientIcon from '@/public/image/client-icon.svg';
import { useMounted } from '@/hooks/use-mounted';

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const role = useCurrentRole();
  const user = useCurrentUser();
  const mounted = useMounted();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/asset', label: 'Asset' },
    { href: '/task', label: 'Task' },
  ];

  function onClick() {
    logout();
  }

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
          className="px-4 sm:hidden"
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
          variant="light"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              variant="faded"
              size="sm"
              startContent={<CircleUserRound size={18} />}
            >
              {user?.name}
            </Button>
          </DropdownTrigger>
          {role === 'ADMIN' ? (
            <DropdownMenu aria-label="Profile Actions" variant="faded">
              <DropdownItem key="name">{user?.name}</DropdownItem>
              <DropdownItem key="email">{user?.email}</DropdownItem>
              <DropdownItem key="account">My Account</DropdownItem>
              <DropdownItem key="admin" href="/admin">
                Admin Settings
              </DropdownItem>
              <DropdownItem color="danger" key="real" onClick={onClick}>
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <DropdownMenu aria-label="Profile Actions" variant="faded">
              <DropdownItem
                key="account"
                startContent={<CircleUserRound size={18} />}
              >
                My Account
              </DropdownItem>
              <DropdownItem
                color="danger"
                key="sign-out"
                startContent={<DoorOpen size={18} />}
                onClick={onClick}
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          )}
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
