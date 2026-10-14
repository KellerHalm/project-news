'use client';

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { PasswordInput } from '../password-input';

type ControlledPasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
} & Omit<
  React.ComponentProps<typeof PasswordInput>,
  'label' | 'error' | 'name' | 'value' | 'defaultValue'
>;

export function ControlledPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: ControlledPasswordInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PasswordInput
          label={label}
          error={fieldState.error?.message}
          aria-invalid={fieldState.invalid}
          {...inputProps}
          {...field}
        />
      )}
    />
  );
}
