export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  field?: string;
  code?: string;
}

export class ValidationError extends Error {
  public readonly type = ErrorType.VALIDATION;
  public readonly field?: string;
  public readonly details?: string;

  constructor(message: string, field?: string, details?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.details = details;
  }
}

export class NetworkError extends Error {
  public readonly type = ErrorType.NETWORK;
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
  }
}

export class NotFoundError extends Error {
  public readonly type = ErrorType.NOT_FOUND;
  public readonly resource?: string;

  constructor(message: string, resource?: string) {
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

export class UnauthorizedError extends Error {
  public readonly type = ErrorType.UNAUTHORIZED;

  constructor(message: string = 'Non autorisé') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ServerError extends Error {
  public readonly type = ErrorType.SERVER;
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ServerError';
    this.code = code;
  }
}

export const createAppError = (error: unknown): AppError => {
  if (error instanceof ValidationError) {
    return {
      type: error.type,
      message: error.message,
      field: error.field,
      details: error.details
    };
  }

  if (error instanceof NetworkError) {
    return {
      type: error.type,
      message: error.message,
      code: error.code
    };
  }

  if (error instanceof NotFoundError) {
    return {
      type: error.type,
      message: error.message,
      details: error.resource
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      type: error.type,
      message: error.message
    };
  }

  if (error instanceof ServerError) {
    return {
      type: error.type,
      message: error.message,
      code: error.code
    };
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message
    };
  }

  return {
    type: ErrorType.UNKNOWN,
    message: 'Une erreur inconnue s\'est produite'
  };
};
