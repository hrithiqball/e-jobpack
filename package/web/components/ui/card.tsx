'use client';

import { PropsWithChildren } from 'react';

import { Card, CardBody } from '@nextui-org/react';

export default function CardLayout({ children }: PropsWithChildren) {
  return (
    <Card
      shadow="none"
      className="m-4 flex flex-1 flex-col bg-timberwolf dark:bg-zinc-900"
    >
      <CardBody className="flex flex-1">{children}</CardBody>
    </Card>
  );
}
