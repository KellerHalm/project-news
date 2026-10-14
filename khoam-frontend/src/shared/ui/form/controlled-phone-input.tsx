'use client';

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';

import { PhoneInput } from '../phone-input';

type ControlledPhoneInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
} & Omit<
  React.ComponentProps<typeof PhoneInput>,
  'label' | 'error' | 'name' | 'onChangeValue' | 'defaultValue'
>;

export function ControlledPhoneInput<T extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: ControlledPhoneInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PhoneInput
          label={label}
          error={fieldState.error?.message}
          aria-invalid={fieldState.invalid}
          {...inputProps}
          onChangeValue={field.onChange}
          onBlur={field.onBlur}
          defaultValue={field.value}
        />
      )}
    />
  );
}
