
import { PrismaClient } from '@prisma/postgresql/generated/postgresql';
import prisma, { PrismaTransactionalClient } from '@prisma/postgresql/connection';

export class CustomersRepository {
  constructor(
    private readonly prisma: PrismaClient | PrismaTransactionalClient
  ) {}

  static getInstance() {
    return new CustomersRepository(prisma);
  }

  static transaction(trx: PrismaTransactionalClient) {
    return new CustomersRepository(trx);
  }

  findUserByPhone(phone: string) {
    return this.prisma.customer.findFirst({ where: { phone } });
  }
}

export default CustomersRepository.getInstance();
