'use client';

import { ArrowLeft } from 'lucide-react';
import React from 'react';

import { ArrowIcon, DeleteIcon } from '@/shared/icons/24';
import { CameraIcon } from '@/shared/icons/40';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
  Typography
} from '@/shared/ui';

import styles from './create-news-from.module.scss';

const SELECT_OPTIONS = [
  { value: 'news', label: 'Новости' },
  { value: 'sport', label: 'Спорт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'innovations', label: 'Инновации' },
  { value: 'art', label: 'Искусство' },
  { value: 'trips', label: 'Путешествия' },
  { value: 'other', label: 'Иное' }
] as const;

export default function CreateNewsForm({ onClose }: { onClose: () => void }) {
  const [selectValue, setSelectValue] = React.useState<string>('');

  const selectedLabel = SELECT_OPTIONS.find(
    option => option.value === selectValue
  )?.label;

  return (
    <form className={styles.form}>
      <div className="flex items-center gap-2">
        <ArrowLeft onClick={onClose} className="cursor-pointer" />

        <Typography variant="h1">Новая статья</Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Input
          type="text"
          name="title"
          label="Заголовок"
          placeholder="Заголовок"
          autoComplete="title"
          required
        />

        <Select value={selectValue} onValueChange={setSelectValue}>
          <SelectTrigger>
            <Input
              rootClassName="w-full"
              label="Категория"
              className="cursor-pointer"
              value={selectedLabel ?? ''}
              placeholder="Выберите категорию"
              endAdornment={<ArrowIcon />}
              readOnly
            />
          </SelectTrigger>
          <SelectContent position="popper">
            {SELECT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-3">
          <Typography variant="h5">Изображения и видео</Typography>
          <div className="flex flex-wrap gap-6">
            <label className={styles.uploadButton}>
              <CameraIcon />
              <Input type="file" accept="image/*" multiple hidden />
            </label>

            {[1, 2, 3].map(i => (
              <div key={i} className={styles.preview}>
                <button type="button" className={styles.previewClose}>
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </div>
          <Typography variant="body3">
            Можно загрузить до 10 изображений и видео.
          </Typography>
        </div>

        <Textarea
          name="content"
          label="Контент"
          placeholder="Начните писать статью..."
          required
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Button variant="outline" type="button">
          Сохранить черновик
        </Button>
        <Button variant="default" type="submit">
          Опубликовать
        </Button>
      </div>
    </form>
  );
}
