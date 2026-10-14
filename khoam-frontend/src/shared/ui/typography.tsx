import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cn } from '@/shared/utils';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body3'
  | 'caption';

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'body1',
  body3: 'body3',
  caption: 'caption'
};

const defaultVariantMapping: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'p',
  h4: 'p',
  h5: 'p',
  h6: 'p',
  body1: 'p',
  body3: 'p',
  caption: 'p'
};

type TypographyProps<C extends ElementType = ElementType> = {
  component?: C;
  variant?: TypographyVariant;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<C>, 'className' | 'children'>;

export function Typography<C extends ElementType = 'p'>({
  component,
  variant = 'body1',
  className,
  ...props
}: TypographyProps<C>) {
  const Component = (component ??
    defaultVariantMapping[variant]) as ElementType;

  return (
    <Component className={cn(variantClasses[variant], className)} {...props} />
  );
}
