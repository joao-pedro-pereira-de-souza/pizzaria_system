import { jest } from '@jest/globals';


export function CreateMockModuleRedis() {

  const redisMock = {
    __esModule: true,
    createClient: jest.fn(() => {
      return {
        connect: jest.fn(),
        on: jest.fn(),
        quit: jest.fn(),
        set: jest.fn(()=> 'OK'),
      };
    })

  };

  jest.mock('redis', () => {
    return redisMock;
  });
}
