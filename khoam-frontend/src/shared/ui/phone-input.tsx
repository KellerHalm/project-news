'use client';

import * as React from 'react';
import { useIMask } from 'react-imask';

import { Input } from './input';

type PhoneInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'onChange'
> & {
  onChangeValue?: (unmaskedValue: string) => void;
};

export function PhoneInput({ onChangeValue, ...props }: PhoneInputProps) {
  const { ref, value, unmaskedValue } = useIMask({
    mask: '+7 (T00) 000-00-00',
    lazy: true,
    definitions: {
      T: /[0-79]/
    }
  });

  React.useEffect(() => {
    onChangeValue?.(unmaskedValue);
    // sync form value only when the masked input changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      {...props}
      ref={ref as React.RefObject<HTMLInputElement>}
      type="tel"
      inputMode="tel"
    />
  );
}

export type { PhoneInputProps };
