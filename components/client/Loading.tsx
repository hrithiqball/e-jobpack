import React from 'react';
import { Spinner } from '@nextui-org/react';

function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner label={label} color="primary" />
    </div>
  );
}

export default Loading;
