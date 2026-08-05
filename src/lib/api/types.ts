export type ApiFieldError = {
  field?: string;
  message: string;
};

export type ApiSuccess<T> = {
  data: T;
  message: string | null;
  success: true;
};

export type ApiFailure = {
  errors: ApiFieldError[];
  message: string;
  success: false;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};
