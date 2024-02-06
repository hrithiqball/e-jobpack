'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  Button,
  Card,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
} from '@nextui-org/react';
import { toast } from 'sonner';

import { createUser } from '@/lib/actions/user';

export default function SignUpCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signUpClient = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    }

    try {
      startTransition(() => {
        createUser(name, email, password)
          .then(res => {
            router.replace('/auth/login');
            toast.success(`User ${res.name} created successfully`);
          })
          .catch(err => {
            console.error(err);
          });
      });
    } catch (error) {
      console.error(error);
    }
  };

  function handleName(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handlePhone(event: React.ChangeEvent<HTMLInputElement>) {
    setPhone(event.target.value);
  }

  function handleConfirmPassword(event: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card shadow="none" title="Sign Up" className="w-90 p-4">
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
          value={name}
          onChange={handleName}
          name="name"
          placeholder="Name"
          className="mb-4 mt-4"
        />
        <Input
          value={phone}
          onChange={handlePhone}
          name="phone"
          placeholder="Phone"
          className="mb-4 mt-4"
        />
        <Input
          type="email"
          value={email}
          onChange={handleEmail}
          name="email"
          placeholder="Email"
          className="mb-4 mt-4"
        />
        <Input
          type="password"
          value={password}
          onChange={handlePassword}
          name="password"
          placeholder="Password"
          className="mb-4 mt-4"
        />
        <Input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="mb-4 mt-4"
        />
        <Divider />
        <Button
          isDisabled={isPending}
          variant="faded"
          className="mt-4 w-full"
          onClick={signUpClient}
        >
          Sign Up
        </Button>
        <Link
          href="/auth/login"
          className="mt-4 self-center text-center align-middle text-blue-500 hover:underline"
        >
          Sign In
        </Link>
      </Card>
    </div>
  );
}