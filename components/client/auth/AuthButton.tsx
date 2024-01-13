'use client';

import React from 'react';
import { Button, Link } from '@nextui-org/react';

export default function AuthButton() {
  return (
    <Button as={Link} href="/auth/login">
      Sign In
    </Button>
  );
}
