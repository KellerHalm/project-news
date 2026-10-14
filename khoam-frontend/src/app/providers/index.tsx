'use client';

import { composeProviders } from '@/shared/utils';

import { WithQueryClient } from './with-query-client';
import { withTheme } from './with-theme';
import { WithToaster } from './with-toaster';

export const WithProviders = composeProviders([
  WithQueryClient,
  withTheme,
  WithToaster
]);
