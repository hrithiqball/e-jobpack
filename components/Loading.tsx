import React from 'react';

import { Spinner } from '@nextui-org/react';

type LoadingProps = {
  label: string;
};

export default function Loading({ label }: LoadingProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner label={label} color="primary" />
    </div>
  );
}
