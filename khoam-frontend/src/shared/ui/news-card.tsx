import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/utils';

import { Typography } from './typography';

type NewsCardProps = React.ComponentProps<'article'> &
  VariantProps<typeof newsCardVariants> & {
    asChild?: boolean;
  } & {
    contentClassName?: string | string[];
    title: string;
    preview?: string;
    date: string;
    author: string;
    endAdornment?: React.ReactNode;
  };

const newsCardVariants = cva('flex', {
  variants: {
    variant: {
      default: 'gap-4',
      secondary: 'gap-6'
    },
    size: {
      default: 'flex-col',
      sm: 'flex-row'
    }
  },
  compoundVariants: [
    {
      variant: 'default',
      size: 'sm',
      class: 'items-center'
    },
    {
      variant: 'secondary',
      size: 'sm',
      class: 'items-center'
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

const newsContentVariants = cva('flex flex-col', {
  variants: {
    variant: {
      default: 'gap-4 flex-col-reverse',
      secondary: 'gap-6'
    },
    size: {
      default: '',
      sm: ''
    }
  },
  compoundVariants: [
    {
      variant: 'default',
      size: 'sm',
      class: ''
    },
    {
      variant: 'secondary',
      size: 'sm',
      class: 'gap-3'
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
});

function NewsTitle({ variant, size, title }: NewsCardProps) {
  const typographyVariant =
    variant === 'default' && size === 'default'
      ? 'h2'
      : variant === 'default' && size === 'sm'
        ? 'h4'
        : variant === 'secondary' && size === 'default'
          ? 'h1'
          : 'h3';

  return (
    <Typography
      variant={typographyVariant}
      className="line-clamp-2 whitespace-pre-line"
    >
      {title}
    </Typography>
  );
}

function NewsSubtitle({ variant, size, author, date }: NewsCardProps) {
  const typographyVariant =
    variant === 'default'
      ? 'body1'
      : variant === 'secondary' && size === 'default'
        ? 'body1'
        : 'caption';

  return (
    <Typography
      variant={typographyVariant}
      className="whitespace-nowrap flex items-center gap-2 sm:gap-6"
    >
      <span className="max-w-10 sm:max-w-24 line-clamp-1 whitespace-pre-line">
        {author}
      </span>
      <span className="w-px h-6 bg-black opacity-50" />
      <span>{date}</span>
    </Typography>
  );
}

function NewsPreview({ variant, size, preview }: NewsCardProps) {
  if (!preview) return;

  const imageSize =
    variant === 'default' && size === 'default'
      ? 'min-w-full w-full sm:!min-w-[400px] lg:min-w-[546px] h-[348px]'
      : variant === 'default' && size === 'sm'
        ? 'size-24'
        : variant === 'secondary' && size === 'default'
          ? 'w-full h-[348px] lg:min-w-[448px]'
          : 'min-w-36 h-24';

  return (
    <img
      src={preview}
      alt="Preview"
      className={cn('rounded-2xl shrink-0', imageSize)}
    />
  );
}

function NewsCard({
  className,
  contentClassName,
  variant = 'default',
  size = 'default',
  asChild = false,
  endAdornment,
  ...props
}: NewsCardProps) {
  const Comp = asChild ? Slot : 'article';

  return (
    <Comp
      data-slot="article"
      className={cn(newsCardVariants({ variant, size, className }))}
      {...props}
    >
      <NewsPreview variant={variant} size={size} {...props} />

      <div
        className={cn(
          'min-w-0 flex-1',
          newsContentVariants({ variant, size, className: contentClassName })
        )}
      >
        <NewsTitle variant={variant} size={size} {...props} />
        <NewsSubtitle variant={variant} size={size} {...props} />
      </div>

      {endAdornment}
    </Comp>
  );
}

export { NewsCard, newsCardVariants };
