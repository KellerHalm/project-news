import axios, { type AxiosResponse, type CancelToken } from 'axios';
import { nanoid } from 'nanoid';

import { Endpoints } from '../constants';
import { type AcceptedFileType, FileError, type UploadFileObj } from '../model';
import { errorNotification } from '../utils';

interface UploadFileProps {
  /** Локальный файл */
  file: File;

  /** Уникальный ключ файла по которому будет передавать процент его загрузки */
  uniqKey: string;

  /** См. https://axios-http.com/ru/docs/cancellation */
  cancelToken?: CancelToken;

  /** Функция возвращает процент загрузки для конкретного файла */
  onProgress?: (uniqFileKey: string, value: number) => void;
}

/**
 * Функция для загрузки файла на сервер
 */
export const uploadFile = async <T>({
  file,
  uniqKey,
  cancelToken,
  onProgress
}: UploadFileProps): Promise<T> => {
  const formData = new FormData();
  formData.append('files[]', file);

  return (
    await axios.post<unknown, AxiosResponse<T>>(
      Endpoints.MEDIAS_UPLOAD,
      formData,
      {
        cancelToken,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress(progressEvent) {
          const total = progressEvent.total ?? 100;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          onProgress?.(uniqKey, percent);
        }
      }
    )
  ).data;
};

const getFileType = (file: File) => {
  const splitted = file.name.split('.');

  return splitted[splitted.length - 1];
};

const checkAcceptedFileType = (
  fileType: AcceptedFileType,
  types: AcceptedFileType[]
) => {
  return types.includes(fileType.toLocaleLowerCase());
};

const checkMaxFileSize = (file: File, maxFileSize: number) =>
  file.size <= maxFileSize * Math.pow(1024, 2);

/**
 * Возвращает текст ошибки для загружаемого файла
 */
export const getUploadFileErrorText = (
  file: File,
  maxFileSize: number,
  acceptedTypes: AcceptedFileType[]
): string | undefined => {
  const fileType = getFileType(file);
  const isAcceptedFileType = checkAcceptedFileType(fileType, acceptedTypes);
  const isCorrectFileSize = checkMaxFileSize(file, maxFileSize);

  if (!isAcceptedFileType) {
    return FileError.EXTENSION;
  }

  if (!isCorrectFileSize) {
    return FileError.MAX_SIZE;
  }
};

/**
 * Возвращает url полученного файла
 */
export const createFileUrl = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = event => {
      const preview = event.target?.result as string | undefined;
      if (preview) {
        resolve(preview);
      } else {
        errorNotification({
          message: 'Не удалось прочитать файл.'
        });
      }
    };

    reader.onerror = () => {
      errorNotification({
        message: 'Не удалось прочитать файл.'
      });
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Функция генерирует специальный объект для отображения его в очереди на загрузку
 */
export const makeUploadFileObj = async (
  file: File,
  maxFileSize: number,
  acceptedFileTypes: AcceptedFileType[]
): Promise<UploadFileObj> => {
  const cancelTokenSource = axios.CancelToken.source();
  const errorText = getUploadFileErrorText(
    file,
    maxFileSize,
    acceptedFileTypes
  );
  const fileUrl = await createFileUrl(file);

  return {
    fileId: null,
    fileUrl: fileUrl,
    mime: file.type,
    key: nanoid(),
    file,
    progress: 0,
    isUploaded: false,
    cancelTokenSource,
    errorText
  };
};
