import * as React from 'react';

import { cn } from '@/shared/utils';

import { Typography } from './typography';

type TextareaProps = React.ComponentProps<'textarea'> & {
  label?: string;
  error?: string;
  rootClassName?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      rootClassName,
      label,
      error,
      id,
      disabled,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const isInvalid = !!error || !!ariaInvalid;

    return (
      <div className={cn('flex flex-col', rootClassName)}>
        {label && (
          <Typography
            variant="h5"
            component="label"
            htmlFor={textareaId}
            className="mb-3"
          >
            {label}
          </Typography>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          data-slot="textarea"
          disabled={disabled}
          aria-invalid={isInvalid}
          className={cn(
            'bg-(--neutral-20) dark:bg-input/30 placeholder:text-(--neutral-70) selection:bg-primary selection:text-primary-foreground',
            'min-h-[400px] w-full resize-none rounded-[10px]',
            'px-5 py-4',
            'h4 text-(--neutral-70)',
            'outline-none transition-[color,box-shadow]',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            isInvalid &&
              'border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          {...props}
        />

        {error && (
          <Typography variant="caption" className="mt-1 text-destructive">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

export { Textarea };
export type { TextareaProps };
