import { PropsWithChildren } from 'react';

export function Wrapper({ children }: PropsWithChildren) {
  return <div className="flex flex-1 flex-col space-y-4">{children}</div>;
}
