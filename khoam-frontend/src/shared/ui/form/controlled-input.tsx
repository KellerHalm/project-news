'use client';

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { Input } from '../input';

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
} & Omit<
  React.ComponentProps<typeof Input>,
  'label' | 'error' | 'name' | 'value' | 'defaultValue'
>;

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  ...inputProps
}: ControlledInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          label={label}
          type={type}
          error={fieldState.error?.message}
          aria-invalid={fieldState.invalid}
          {...inputProps}
          {...field}
        />
      )}
    />
  );
}
