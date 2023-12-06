'use client';

import React, { useState, useTransition } from 'react';
import { SignUpUser } from '@/utils/model/user';
import { signUp } from '@/utils/actions/route';
import {
  Button,
  Card,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
} from '@nextui-org/react';

export default function SignUpCard() {
  let [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function signUpClient() {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    }

    const userInfo: SignUpUser = {
      name,
      email,
      password,
      phone,
    };

    startTransition(() => {
      signUp(userInfo);
    });
  }

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
    <div className="flex items-center justify-center h-screen">
      <Card title="Sign Up" className="w-90 p-4 shadow-md">
        <CardHeader className="flex gap-3">
          <Image
            alt="Asset Management System"
            height={40}
            radius="sm"
            src="../favicon.ico"
            width={40}
          />
          <p className="text-md">Asset Management System</p>
        </CardHeader>
        <Divider />
        <Input
          value={name}
          onChange={handleName}
          name="name"
          placeholder="Name"
          className="mt-4 mb-4"
        />
        <Input
          value={phone}
          onChange={handlePhone}
          name="phone"
          placeholder="Phone"
          className="mt-4 mb-4"
        />
        <Input
          value={email}
          onChange={handleEmail}
          name="email"
          placeholder="Email"
          className="mt-4 mb-4"
        />
        <Input
          value={password}
          onChange={handlePassword}
          name="password"
          placeholder="Password"
          className="mt-4 mb-4"
        />
        <Input
          value={confirmPassword}
          onChange={handleConfirmPassword}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="mt-4 mb-4"
        />
        <Divider />
        <Button variant="solid" className="w-full mt-4" onClick={signUpClient}>
          Sign Up
        </Button>
        <Link
          href="/sign-in"
          className="text-blue-500 hover:underline mt-4 align-middle self-center text-center"
        >
          Sign In
        </Link>
      </Card>
    </div>
  );
}
