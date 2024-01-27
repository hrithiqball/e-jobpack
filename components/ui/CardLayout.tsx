'use client';

import React, { PropsWithChildren } from 'react';

import { Card, CardBody } from '@nextui-org/react';

export default function CardLayout({ children }: PropsWithChildren) {
  return (
    <Card className="flex flex-1 flex-col m-4 bg-zinc-300 dark:bg-zinc-700">
      <CardBody className="flex flex-grow">{children}</CardBody>
    </Card>
  );
}
