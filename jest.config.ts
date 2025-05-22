import type { Config } from 'jest';
const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@security/(.*)$': '<rootDir>/src/security/$1',
    '^@schema/(.*)$': '<rootDir>/src/schema/$1',
    '^@error/(.*)$': '<rootDir>/src/error/$1',
    '^@prisma/(.*)$': '<rootDir>/prisma/$1',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  moduleDirectories: ['node_modules', 'src'],
  silent: false,
};

export default config;
