import Image from 'next/image';

import { Navbar, NavbarBrand, NavbarContent } from '@nextui-org/react';
import { Skeleton } from '@/components/ui/skeleton';

import { useMediaQuery } from '@/hooks/use-media-query';
import clientIcon from '@/public/image/client-icon.svg';

export default function NavigationBarSkeleton() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <Navbar disableAnimation maxWidth="full">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Image
            priority
            src={clientIcon}
            alt="Petronas Logo"
            className="mr-3 w-6"
          />
          {isDesktop && <p className="font-bold text-inherit">e-Jobpack</p>}
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-6 w-32" />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
