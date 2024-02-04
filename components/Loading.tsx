import React from 'react';

import { Spinner } from '@nextui-org/react';

type LoadingProps = {
  label: string;
};

export default function Loading({ label }: LoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner label={label} color="primary" />
    </div>
  );
}
