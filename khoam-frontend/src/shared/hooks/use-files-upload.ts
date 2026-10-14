import React from 'react';

import { makeUploadFileObj, uploadFile } from '../helpers';
import {
  type AcceptedFileType,
  FileError,
  MediaEntity,
  type UploadFileObj
} from '../model';
import { errorNotification } from '../utils';

export type HookProps = Partial<{
  /** Доступные расширения */
  acceptedFileTypes: AcceptedFileType[];

  /** Максимальный размер файла в Мб. */
  maxFileSize: number;

  /** Максимальное кол-во выбираемых элементов */
  filesLimit: number;

  /** Функция вызывается при превышении лимита на кол-во файлов */
  onLimit: VoidFunction;

  /** Функция вызывается при успешной загрузке файла */
  onFileUploaded?: (fileObj: UploadFileObj) => void;
}>;

export interface ReturnProps {
  /** Список файлов в очереди загрузки */
  files: UploadFileObj[];
  /** Ручная установка списка файлов */
  setFiles: (files: UploadFileObj[]) => void;
  /** Ref на скрытый input[type=file] */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Идёт ли сейчас загрузка хотя бы одного файла */
  isUploading: boolean;
  /** Удаление файла из списка по индексу (с отменой запроса) */
  removeFileByIndex: (index: number) => void;
  /** Очистка всего списка файлов */
  removeAllFiles: () => void;
  /**
   * Добавление файлов в список с валидацией и загрузкой на сервер.
   * При `onlyAdd=true` файл только добавляется в список без upload.
   */
  addFiles: (files: FileList | File[], onlyAdd?: boolean) => void;
  /** Заменить файл по индексу (загружает новый файл и подставляет результат). Для постов — редактирование после загрузки. */
  replaceFileByIndex: (
    index: number,
    file: File,
    onReplacedUpload?: (fileObj: UploadFileObj) => void
  ) => void;
  /** Программное открытие диалога выбора файлов */
  openFileDialog: () => void;
}

type UploadFileObjKeys = keyof UploadFileObj;

const DEFAULT_ACCEPTED_FILE_TYPES = [
  'mp4',
  'ogx',
  'oga',
  'ogv',
  'ogg',
  'webm',
  'jpeg',
  'jpg',
  'png',
  'webp',
  'heic',
  'png',
  'pdf',
  'txt'
] as AcceptedFileType[];

/**
 * Хук для массовой/одиночной загрузки файлов
 *
 * @example
 * const { inputRef, addFiles, removeFileByIndex, files } = useFilesUpload();
 *
 * <input onChange={e => addFiles(e.target.files)} type='file' ref={inputRef} />
 *
 * @returns Объект со списком файлов, ref на input, методами добавления/удаления и флагом загрузки
 */
export function useFilesUpload({
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  maxFileSize = 100,
  filesLimit,
  onLimit,
  onFileUploaded
}: HookProps = {}): ReturnProps {
  const [files, setFiles] = React.useState<UploadFileObj[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isUploading = React.useMemo(
    () => files.some(f => !f.isUploaded && !f.errorText),
    [files]
  );

  const updateFile = <T extends UploadFileObj, K extends UploadFileObjKeys>(
    uniqKey: string,
    fields: Record<K, T[K]>
  ) => {
    setFiles(prev =>
      prev.map(obj => {
        if (obj.key === uniqKey) {
          return {
            ...obj,
            ...fields
          };
        }

        return obj;
      })
    );
  };

  /**
   * Удаление файла из списка
   */
  const removeFileByIndex = React.useCallback(
    (index: number) => {
      const file = files[index];
      if (file) {
        file.cancelTokenSource?.cancel();
        setFiles(prev => prev.filter((_, i) => i !== index));
      }
    },
    [files]
  );

  /**
   * Удаление всех файлов из списка
   */
  const removeAllFiles = React.useCallback(() => {
    setFiles([]);
  }, [files]);

  /**
   * Открытие окна выбора файла
   */
  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  /**
   * Заменить файл по индексу: загружает новый файл на сервер и подставляет результат в список.
   */
  const replaceFileByIndex = React.useCallback(
    (
      index: number,
      file: File,
      onReplacedUpload?: (fileObj: UploadFileObj) => void
    ) => {
      makeUploadFileObj(file, maxFileSize, acceptedFileTypes).then(
        async fileObj => {
          if (fileObj.errorText) {
            errorNotification({ message: fileObj.errorText });
            return;
          }

          setFiles(prev => prev.map((f, i) => (i === index ? fileObj : f)));

          try {
            const data = await uploadFile<MediaEntity[]>({
              file,
              uniqKey: fileObj.key,
              cancelToken: fileObj.cancelTokenSource?.token,
              onProgress: (key, progress) => {
                updateFile(key, { progress: progress - 1 });
              }
            });

            const updated = {
              ...fileObj,
              fileId: data[0].id,
              mime: data[0].mimeType,
              isUploaded: true,
              progress: 0
            };

            updateFile(fileObj.key, {
              fileId: data[0].id,
              mime: data[0].mimeType,
              isUploaded: true,
              progress: 0
            });

            onReplacedUpload?.(updated);
          } catch (err) {
            errorNotification(err);

            updateFile(fileObj.key, {
              progress: 0,
              errorText: FileError.UNKNOWN
            });
          }
        }
      );
    },
    [acceptedFileTypes, maxFileSize, onFileUploaded]
  );

  /**
   * Добавление файлов в список
   */
  const addFiles = React.useCallback(
    (files: FileList | File[], onlyAdd: boolean = false) => {
      // Если выбрано слишком много файлов, запрещаем загрузку всех файлов
      const hasFilesLimit = filesLimit && onLimit && files.length > filesLimit;

      if (hasFilesLimit) {
        onLimit();
        return;
      }

      const list = Array.from(files);

      // В ином случае, показываем выбранные файлы, но запрещённые к загрузке помечаем в списке
      list.forEach(async file => {
        const fileObj = await makeUploadFileObj(
          file,
          maxFileSize,
          acceptedFileTypes
        );

        if (fileObj.errorText) {
          errorNotification({ message: fileObj.errorText });
          return;
        }

        setFiles(prev => [...prev, fileObj]);

        if (onlyAdd) return onFileUploaded?.(fileObj);

        try {
          const data = await uploadFile<MediaEntity[]>({
            file,
            uniqKey: fileObj.key,
            cancelToken: fileObj.cancelTokenSource?.token,
            onProgress: (key, progress) => {
              updateFile(key, {
                progress: progress - 1
              });
            }
          });

          onFileUploaded?.({
            ...fileObj,
            fileId: data[0].id,
            mime: data[0].mimeType
          });
          updateFile(fileObj.key, {
            fileId: data[0].id,
            mime: data[0].mimeType,
            isUploaded: true,
            progress: 0
          });
        } catch (err) {
          errorNotification(err);

          updateFile(fileObj.key, {
            progress: 0,
            errorText: FileError.UNKNOWN
          });
        }
      });
    },
    [acceptedFileTypes, filesLimit, maxFileSize, onLimit]
  );

  /**
   * Устанавливаем список доступных расширений в input.
   * Таким образом, окно выбора файлов будет знать, какие расширения файлов доступны
   */
  React.useEffect(() => {
    const inputElem = inputRef.current;

    if (inputElem && acceptedFileTypes.length) {
      inputElem.accept = '.' + acceptedFileTypes.join(',.');
    }
  }, [acceptedFileTypes]);

  return {
    files,
    setFiles,
    inputRef,
    addFiles,
    isUploading,
    removeFileByIndex,
    replaceFileByIndex,
    removeAllFiles,
    openFileDialog
  };
}
