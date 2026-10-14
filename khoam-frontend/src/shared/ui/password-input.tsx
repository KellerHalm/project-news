'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import { Input } from './input';

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'type' | 'endAdornment'
>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(show => !show);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <Button
            variant="text"
            type="button"
            size="icon"
            className="size-6 p-0"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <EyeOffIcon className="text-muted-foreground size-6" />
            ) : (
              <EyeIcon className="text-muted-foreground size-6" />
            )}
          </Button>
        }
      />
    );
  }
);

export { PasswordInput };
export type { PasswordInputProps };
