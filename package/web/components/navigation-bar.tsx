'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from '@nextui-org/react';
import {
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverItemDestructive,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { CircleUserRound, DoorOpen, Moon, Shield, Sun } from 'lucide-react';

import { useCurrentRole } from '@/hooks/use-current-role';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMounted } from '@/hooks/use-mounted';

import { logout } from '@/data/logout.action';
import clientIcon from '@/public/image/client-icon.svg';

import NavigationBarSkeleton from './navigation-bar-skeleton';

export default function NavigationBar() {
  const { theme, setTheme } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const pathname = usePathname();
  const role = useCurrentRole();
  const user = useCurrentUser();
  const mounted = useMounted();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/asset', label: 'Asset' },
    { href: '/maintenance', label: 'Maintenance' },
    { href: '/task', label: 'Task' },
  ];

  function handleAccountRoute() {
    router.push(`/user/${user?.id}`);
  }

  function handleAdminRoute() {
    router.push('/admin');
  }

  function handleLogout() {
    logout();
  }

  if (!mounted) return <NavigationBarSkeleton />;

  return (
    <Navbar
      disableAnimation
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className="relative flex w-full items-center justify-between"
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="px-4 sm:hidden"
        />
        <NavbarBrand>
          <Link href="/dashboard" className="hover:cursor-pointer">
            <Image
              priority
              src={clientIcon}
              alt="Petronas Logo"
              className="mr-3 w-6"
            />
            {isDesktop && <p className="font-bold text-inherit">e-Jobpack</p>}
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden gap-4 sm:flex">
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
          size="icon"
          variant="ghost"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="withIcon">
              <CircleUserRound size={18} />
              <p>{user?.name}</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 rounded-lg p-2">
            <PopoverItem
              onClick={handleAccountRoute}
              startContent={<CircleUserRound size={18} />}
            >
              My Account
            </PopoverItem>
            {role === 'ADMIN' && (
              <PopoverItem
                onClick={handleAdminRoute}
                startContent={<Shield size={18} />}
              >
                Admin Settings
              </PopoverItem>
            )}
            <PopoverItemDestructive
              onClick={handleLogout}
              startContent={<DoorOpen size={18} />}
            >
              Sign Out
            </PopoverItemDestructive>
          </PopoverContent>
        </Popover>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem key="dashboard">
          <Link
            size="lg"
            color={pathname === '/dashboard' ? 'primary' : 'foreground'}
            href="/dashboard"
            className="w-full"
          >
            Dashboard
          </Link>
        </NavbarMenuItem>
        {navLinks.map(item => {
          const isCurrentPage = pathname === item.href;
          const linkColor = isCurrentPage ? 'primary' : 'foreground';

          return (
            <NavbarMenuItem key={item.href}>
              <Link
                size="lg"
                color={linkColor}
                href={item.href}
                className="w-full"
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
