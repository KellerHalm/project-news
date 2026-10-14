import { cn } from '../utils';
import { Typography } from './typography';

interface Props {
  text: string;
  size?: 'sm' | 'default';
}

export function Title({ text, size = 'default' }: Props) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          'w-3 shrink-0 bg-[#303030]',
          size === 'sm' ? 'h-7' : 'h-8'
        )}
      />

      <Typography variant={size === 'sm' ? 'h4' : 'h3'}>{text}</Typography>
    </div>
  );
}
