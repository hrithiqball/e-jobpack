'use client';

import { sendTestEmail } from '@/lib/mail';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

export default function TestComponent() {
  let [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      sendTestEmail('harithmu@gmail.com').then(() => {
        if (!isPending) toast.success('Email sent');
      });
    });
  }
  return <button onClick={handleClick}>test</button>;
}
