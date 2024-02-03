'use client';

import React, { PropsWithChildren } from 'react';

import { Card, CardBody } from '@nextui-org/react';

export default function CardLayout({ children }: PropsWithChildren) {
  return (
    <Card
      shadow="none"
      className="flex flex-1 flex-col m-4 bg-zinc-200 dark:bg-zinc-900"
    >
      <CardBody className="flex flex-1">{children}</CardBody>
    </Card>
  );
}
