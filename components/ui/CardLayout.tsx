'use client';

import React, { PropsWithChildren } from 'react';

import { Card, CardBody } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export default function CardLayout({ children }: PropsWithChildren) {
  const { theme } = useTheme();

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
