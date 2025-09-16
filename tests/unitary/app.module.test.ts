import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import cors from 'cors';
import { CreateMockModuleExpress } from '../mocks/index';
import { CreateMockModuleRedis } from '../mocks/redis.module';


describe('#app', () => {
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

  afterEach(() => {
    ClearMocks();
  });
  function ClearMocks() {
    jest.unmock('express');
    jest.unmock('cors');
  }

  it('must have all app configuration parameters NODE_ENV test', async () => {
    process.env.NODE_ENV = 'test';
    const spionExpress = CreateMockModuleExpress();

    await import('@root/src/server.module');

    expect(spionExpress.use).toHaveBeenNthCalledWith(1, spionExpress.json());

    const receivedUseCors: any = spionExpress.use.mock.calls[1][0];
    expect(receivedUseCors.name).toEqual(cors().name);
  });

  it('must have all app configuration parameters NODE_ENV development', async () => {
    process.env.NODE_ENV = 'development';
    jest.unmock('express');

    const spionExpress = CreateMockModuleExpress();
    await import('@root/src/server.module');

    expect(spionExpress.use).toHaveBeenNthCalledWith(1, spionExpress.json());

    const receivedUseCors: any = spionExpress.use.mock.calls[1][0];
    expect(receivedUseCors.name).toEqual(cors().name);

    expect(spionExpress.listen).toHaveBeenCalledTimes(1);
  });
});
