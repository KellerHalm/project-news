import { Typography } from '@/shared/ui';

type NewMiniCardProps = {
  title: string;
  preview: string;
  author: string;
  createAt: string;
};

export const NewMiniCard = ({
  title,
  author,
  createAt,
  preview
}: NewMiniCardProps) => {
  return (
    <article className="flex gap-3">
      <img src={preview} alt="Preview" className="w-24 h-24 rounded-xl" />

      <div>
        <Typography variant="body1" className="mb-2 flex items-center gap-3">
          <span>By {author}</span>

          <span className="h-5 w-px bg-gray-400" />

          <span>{createAt}</span>
        </Typography>

        <Typography variant="h4">{title} </Typography>
      </div>
    </article>
  );
};
