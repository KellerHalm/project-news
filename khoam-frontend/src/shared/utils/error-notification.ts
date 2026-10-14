import { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { ResponseMessage } from '@/shared/model';

const DEFAULT_ERROR_MESSAGE = 'Произошла ошибка';

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as (ResponseMessage & { error?: ResponseMessage }) | undefined;

    if (data?.message || data?.error?.message) {
      return data.message || data.error!.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ResponseMessage).message === 'string'
  ) {
    return (error as ResponseMessage).message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
}

export function errorNotification(error: unknown): void {
  toast.error(getErrorMessage(error));
}
