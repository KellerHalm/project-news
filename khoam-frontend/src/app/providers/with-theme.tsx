'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export const withTheme = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="lyght"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
};
