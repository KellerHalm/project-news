import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/utils';

const buttonVariants = cva(
  "body1 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[16px] border transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:text-current [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-(--neutral-40) focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          'border-(--neutral-90) bg-(--neutral-90) text-(--neutral-10) shadow-[0_4px_6px_rgba(0,0,0,0.09)] hover:border-(--neutral-100) hover:bg-(--neutral-100) active:border-(--neutral-110) active:bg-(--neutral-110) disabled:border-(--neutral-20) disabled:bg-(--neutral-20) disabled:text-(--neutral-40) disabled:shadow-none',
        secondary:
          'border-(--neutral-30) bg-(--neutral-20) text-(--neutral-90) shadow-[0_4px_6px_rgba(0,0,0,0.09)] hover:border-(--neutral-40) hover:bg-(--neutral-30) active:border-(--neutral-40) active:bg-(--neutral-40) disabled:border-(--neutral-20) disabled:bg-(--neutral-20) disabled:text-(--neutral-40) disabled:shadow-none',
        soft: 'border-(--neutral-30) bg-(--neutral-10) text-(--neutral-90) shadow-[0_4px_6px_rgba(0,0,0,0.09)] hover:border-(--neutral-40) hover:bg-(--neutral-20) active:border-(--neutral-40) active:bg-(--neutral-30) disabled:border-(--neutral-20) disabled:bg-(--neutral-20) disabled:text-(--neutral-40) disabled:shadow-none',
        outline:
          'border-(--neutral-20) bg-transparent text-(--neutral-90) shadow-[0_4px_6px_rgba(0,0,0,0.09)] hover:border-(--neutral-30) active:border-(--neutral-100) active:bg-(--neutral-100) active:text-(--neutral-10) disabled:border-(--neutral-30) disabled:text-(--neutral-40) focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-(--neutral-40) dark:text-(--neutral-10) dark:hover:border-(--neutral-10) dark:hover:bg-(--neutral-10) dark:hover:text-(--neutral-90) dark:active:border-(--neutral-20) dark:active:bg-(--neutral-20) dark:active:text-(--neutral-90) dark:disabled:border-(--neutral-70) dark:disabled:text-(--neutral-70)',
        text: 'border-transparent bg-transparent text-(--neutral-90) shadow-none disabled:border-transparent disabled:text-(--neutral-40) focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-(--neutral-10) dark:hover:border-(--neutral-10) dark:hover:bg-(--neutral-10) dark:hover:text-(--neutral-90) dark:active:border-(--neutral-20) dark:active:bg-(--neutral-20) dark:active:text-(--neutral-90) dark:disabled:text-(--neutral-70)',
        link: 'rounded-none border-transparent bg-transparent text-(--neutral-90) shadow-none underline-offset-4 hover:underline active:font-semibold disabled:text-(--neutral-40) dark:text-(--neutral-10) dark:disabled:text-(--neutral-70)',
        destructive:
          'border-destructive bg-destructive text-(--neutral-10) shadow-[0_4px_6px_rgba(0,0,0,0.09)] hover:bg-destructive/90 active:bg-destructive/80 disabled:border-(--neutral-20) disabled:bg-(--neutral-20) disabled:text-(--neutral-40) disabled:shadow-none'
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-4 has-[>svg]:px-3 rounded-[10px]',
        lg: 'h-12 px-6 has-[>svg]:px-5',
        icon: 'relative size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
