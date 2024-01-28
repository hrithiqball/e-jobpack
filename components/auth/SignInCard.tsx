'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Card,
  Button,
  Input,
  CardHeader,
  Image,
  Divider,
  Link,
} from '@nextui-org/react';
import { toast } from 'sonner';

import { login } from '@/lib/actions/login';

export default function SignInCard() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signInClient() {
    startTransition(() => {
      login({ email, password }, callbackUrl).then(data => {
        if (data?.error) {
          if (!isPending) console.error(data.error);
          toast.error(data.error);
          setEmail('');
          setPassword('');
          return;
        }

        toast.success('Login successful', {
          position: 'top-center',
        });
      });
    });
  }

  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card title="Login" className="w-90 p-4 shadow-md">
        <CardHeader className="flex gap-3">
          <Image
            alt="E Jobpack System"
            height={40}
            radius="sm"
            src="../favicon.ico"
            width={40}
          />
          <p className="text-md">E-Jobpack</p>
        </CardHeader>
        <Divider />
        <Input
          value={email}
          onChange={handleEmail}
          name="email"
          size="sm"
          placeholder="Email"
          className="mt-4 mb-4"
        />
        <Input
          value={password}
          onChange={handlePassword}
          name="password"
          type="password"
          placeholder="Password"
          size="sm"
          className="mb-4"
        />
        <Divider />
        <Button variant="faded" className="w-full mt-4" onClick={signInClient}>
          Login
        </Button>
        <Link
          href="/auth/register"
          className="text-blue-500 hover:underline mt-4 align-middle self-center text-center"
        >
          Sign Up
        </Link>
      </Card>
    </div>
  );
}
