export interface ResponseMessage {
  message: string;
}

export interface ResponseMetaEntity {
  /**
   * Текущая страница
   */
  currentPage: number;

  /**
   * Последняя доступная страница
   */
  lastPage: number | null;

  /**
   * Кол-во элементов на страницу
   */
  perPage: number;

  /**
   * Общее количество элементов (остаток)
   */
  total: number;
}

export interface ResponseEntity<T> {
  data: T;
  meta: ResponseMetaEntity;
}

export interface MediaEntity {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  originalName: string;
  mimeType: string;
}

export interface LoginResponse {
  user: UserEntity;
  token: string;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatar?: string | null;
  editorName?: string;
}
