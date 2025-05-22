
import { AxiosResponse } from 'axios';

export class NotFoundError extends Error {
  status: number;
  constructor(message: string) {
    super('NotFoundError');
    this.name = 'NotFoundError';
    this.status = 404;
    this.message = message;
  }
}

export class AuthenticationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

export class ConflictError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

export class UnprocessableEntityError extends Error {
  status: number;
  data?: any;
  constructor(message: string, data?: any) {
    super(message);
    this.name = 'UnprocessableEntity';
    this.status = 422;
    this.data = data;
  }
}

export class AxiosRequestServiceError extends Error {
  status: number;
  data: any;

  constructor(message: string, response: AxiosResponse) {
    super(message);
    this.status = response.status;
    this.data = {
      data: response.data,
      message: response.config.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      timestamp: new Date().toISOString(),
    };
  }
}

export class InternalServerError extends Error {
  status: number;
  context?: string;
  data: any;

  constructor(context?: string, error?: Error | unknown) {
    super('Internal Server Error');
    this.name = 'Internal Server Error';
    this.status = 500;
    this.message = 'Ocorreu um erro no sistema, tente novamente.';
    this.context = context;

    if (error) {
      const stackLines = (error as any).stack?.split('\n');
      const errorLocation = stackLines?.[1]?.trim();

      this.data = {
        local: errorLocation,
        error,
      };

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, InternalServerError);
      }
    }
  }
}

export class ExternalServerError extends Error {
  status: number;
  context?: string;
  data: any;

  constructor(context: string, error?: Error | unknown) {
    super('External Server Error');
    this.name = 'External Server Error';
    this.status = 503;
    this.message =
      'Ocorreu um erro ao consultar um serviço externo, tente novamente mais tarde.';
    this.context = context;

    if (error) {
      const stackLines = (error as any).stack?.split('\n');
      const errorLocation = stackLines?.[1]?.trim();

      this.data = {
        local: errorLocation,
        error,
      };

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, InternalServerError);
      }
    }
  }
}

export const listInstancesError = [
  NotFoundError,
  AuthenticationError,
  ConflictError,
  UnprocessableEntityError,
];


export function HandleInstanceError(error: unknown) {
  if (
    listInstancesError.some((acceptedError) => error instanceof acceptedError)
  ) {
    const response = {
      status: (error as any).status,
      message: (error as any).message,
      data: (error as any).data,
    };
    return response;
  }

  const listErrosInternal = [
    AxiosRequestServiceError,
    InternalServerError,
    ExternalServerError,
  ];

  if (
    listErrosInternal.some((acceptedError) => error instanceof acceptedError)
  ) {
    const response = {
      status:
        error instanceof AxiosRequestServiceError ? 503 : (error as any).status,
      message: (error as any).message,
    };

    return response;
  }

  const errorDefault = new InternalServerError(undefined, error);
  const response = {
    status: errorDefault.status,
    message: errorDefault.message,
  };

  return response;
}


export const allInstancesErrors = [
  NotFoundError,
  AuthenticationError,
  ConflictError,
  UnprocessableEntityError,
  AxiosRequestServiceError,
  InternalServerError,
  ExternalServerError,
];
