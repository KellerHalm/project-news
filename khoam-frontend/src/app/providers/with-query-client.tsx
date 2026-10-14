'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { queryClient } from '@/shared/libs';

export const WithQueryClient = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
