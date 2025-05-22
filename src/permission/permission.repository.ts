import { PrismaClient } from '@prisma/postgresql/generated/postgresql';
import prisma, {
  PrismaTransactionalClient,
} from '@prisma/postgresql/connection';

export class PermissionsRepository {
  constructor(
    private readonly prisma: PrismaClient | PrismaTransactionalClient
  ) {}

  static getInstance() {
    return new PermissionsRepository(prisma);
  }

  static transaction(trx: PrismaTransactionalClient) {
    return new PermissionsRepository(trx);
  }

  findManyNumbers(permissions_numbers: number[]) {
    return this.prisma.permission.findMany({
      where: {
        number_permission: { in: permissions_numbers }
      }
    });
  }
}


export default PermissionsRepository.getInstance();
