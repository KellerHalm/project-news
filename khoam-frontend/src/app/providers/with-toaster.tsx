'use client';

import * as React from 'react';

import { Toaster } from '@/shared/ui';

export function WithToaster({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
