import { PrismaClient } from './generated/sqlite/logs';
export type PrismaTransactionalClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export default new PrismaClient();
