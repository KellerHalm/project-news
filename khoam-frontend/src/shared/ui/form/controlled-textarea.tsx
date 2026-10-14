'use client';

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { Textarea } from '../textarea';

type ControlledTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
} & Omit<
  React.ComponentProps<typeof Textarea>,
  'label' | 'error' | 'name' | 'value' | 'defaultValue'
>;

export function ControlledTextarea<T extends FieldValues>({
  control,
  name,
  label,
  ...textareaProps
}: ControlledTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Textarea
          label={label}
          error={fieldState.error?.message}
          aria-invalid={fieldState.invalid}
          {...textareaProps}
          {...field}
        />
      )}
    />
  );
}
