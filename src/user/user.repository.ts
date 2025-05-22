
import { PrismaClient } from '@prisma/postgresql/generated/postgresql';
import prisma, { PrismaTransactionalClient } from '@prisma/postgresql/connection';

export class UsersRepository {
  constructor(
    private readonly prisma: PrismaClient | PrismaTransactionalClient
  ) {}

  static getInstance() {
    return new UsersRepository(prisma);
  }

  static transaction(trx: PrismaTransactionalClient) {
    return new UsersRepository(trx);
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } });
  }
}

export default UsersRepository.getInstance();
