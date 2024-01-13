'use client';

import { Card, CardBody } from '@nextui-org/react';
import React, { PropsWithChildren } from 'react';

export default function CardLayout({ children }: PropsWithChildren) {
  return (
    <Card className="flex-grow m-4 p-4">
      <CardBody className="flex flex-grow">{children}</CardBody>
    </Card>
  );
}
