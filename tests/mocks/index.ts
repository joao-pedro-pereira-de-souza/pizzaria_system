import { jest } from '@jest/globals';
import { Express, Response } from 'express';

export function CreateMockModuleExpress() {
  const appMock = {
    use: jest.fn(),
    listen: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  } as unknown as jest.Mocked<Express>;

  const expressMock = {
    json: jest.fn(),
    Router: jest.fn(() => {
      return {
        post: jest.fn(),
        get: appMock.get,
        delete: appMock.delete,
        put: appMock.put,
      };
    }),
  };

  jest.mock('express', () => {
    const objectExpressMock: any = jest.fn(() => appMock);

    objectExpressMock.json = expressMock.json;
    objectExpressMock.Router = expressMock.Router;
    objectExpressMock.static = jest.fn(() => 'mocked-static');
    return objectExpressMock;
  });

  return {
    ...appMock,
    json: expressMock.json,
    Router: expressMock.Router,
  };
}

export function MockResponse() {
  const res: any = {};

  res.status = jest.fn().mockImplementation(() => {
    return res as Response;
  });

  res.json = jest.fn().mockImplementation(() => {
    return res as Response;
  });

  res.send = jest.fn().mockImplementation(() => {
    return res as Response;
  });

  res.end = jest.fn().mockImplementation(() => {
    return res as Response;
  });

  return res as Response;
}
