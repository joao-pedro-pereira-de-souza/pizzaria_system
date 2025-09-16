import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Server } from 'http';
import { CreateMockModuleExpress } from '../mocks/index';
import { CreateMockModuleRedis } from '../mocks/redis.module';
describe('#server.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock('prisma/prisma-client', () => {
      return {
        PrismaClient: jest.fn(),
      };
    });

    CreateMockModuleRedis();
  });

  function PromiseListenerServer(server: Server) {
    return new Promise((resolve, reject) => {
      server.on('listening', () => resolve(true));
      server.on('error', () => reject());
    });
  }

  it('should create app server NODE_ENV teste', async () => {

    process.env.NODE_ENV = 'test';

    jest.mock('cors');
    const amountUseAll = 10;
    const mockExpress = CreateMockModuleExpress();

    const { serverInicialize } = await import('@root/src/server.module');

    const { server } = (await serverInicialize);

    expect(mockExpress.use).toHaveBeenCalledTimes(amountUseAll);
    expect(server).toEqual(undefined);

  });

  it('should create app server NODE_ENV development', async () => {
    jest.unmock('express');
    jest.unmock('cors');

    const amountUseAll = 10;

    process.env.NODE_ENV = 'development';
    process.env.PORT = String(3530);

    const { default: expressModule } = await import('express');

    const mockUse = jest.spyOn(expressModule.application, 'use');

    const { serverInicialize } = await import('@root/src/server.module');
    const { server } = (await serverInicialize) as { server: Server };
    await PromiseListenerServer(server);

    expect(server.listening).toEqual(true);

    expect(mockUse).toHaveBeenCalledTimes(amountUseAll);

    server.close();
  });

  it('should create app server NODE_ENV production', async () => {
    jest.unmock('express');
    jest.unmock('cors');
    const amountUseAll = 11;

    process.env.NODE_ENV = 'production';
    process.env.PORT = String(3530);
    const DOMAIN_API = 'http://plataforms_sync.test.api';
    process.env.DOMAIN_API = DOMAIN_API;

    const { default: expressModule } = await import('express');
    const { RateLimitedMiddlewareService } = await import(
      '@middleware/services/ratelimit.service'
    );

    const mockUse = jest.spyOn(expressModule.application, 'use');
    const mockRateLimitMiddlewareInicialize = jest.spyOn(
      RateLimitedMiddlewareService,
      'inicialize'
    );

    const { serverInicialize } = await import('@root/src/server.module');
    const { server } =  (await serverInicialize) as { server: Server };
    await PromiseListenerServer(server);

    expect(server.listening).toEqual(true);

    expect(mockUse).toHaveBeenCalledTimes(amountUseAll);
    expect(mockRateLimitMiddlewareInicialize).toHaveBeenCalledTimes(1);

    server.close();
  });
});
