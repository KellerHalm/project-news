import { CancelTokenSource } from 'axios';

import { MediaEntity } from './entities';

export type AcceptedFileType = 'jpg' | 'jpeg' | 'png' | string;

export interface ResponseFile {
  data: MediaEntity[];
}

export enum FileError {
  MAX_SIZE = 'Превышен максимальный размер файла',
  EXTENSION = 'Недопустимый тип файла',
  UNKNOWN = 'Ошибка при загрузке файла'
}

export interface UploadFileObj {
  fileId: number | null;
  fileUrl: string | null;
  key: string;
  file: File | null;
  isUploaded: boolean;
  mime: string;
  errorText?: string;
  progress?: number;
  cancelTokenSource?: CancelTokenSource;
}
