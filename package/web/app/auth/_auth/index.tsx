'use client';

import Image from 'next/image';

import { Card } from '@nextui-org/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginTab from './login-tab';
import RegisterTab from './register-tab';

export default function AuthComponent() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="m-4 flex flex-1 flex-col p-4">
        <div className="mb-4 flex flex-col items-center justify-center sm:mb-8">
          <Image
            alt="E Jobpack System"
            height={40}
            width={40}
            quality={100}
            src="/favicon.ico"
          />
          <p className="text-md">E-Jobpack</p>
        </div>
        <Tabs defaultValue="login" className="w-96">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card shadow="none" className="p-4 dark:bg-card">
              <LoginTab />
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card shadow="none" className="p-4 dark:bg-card">
              <RegisterTab />
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
