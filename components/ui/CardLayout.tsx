'use client';

import React, { PropsWithChildren, useEffect, useState } from 'react';

import { Card, CardBody } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export default function CardLayout({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card
      className={`flex-grow m-4 p-4 ${
        theme !== 'dark' ? 'bg-slate-200' : 'bg-zinc-900'
      }`}
    >
      <CardBody className="flex flex-grow">{children}</CardBody>
    </Card>
  );
}
