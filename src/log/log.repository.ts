
import { PrismaClient } from '@prisma/sqlite/generated/sqlite/logs';
import prisma, { PrismaTransactionalClient } from '@prisma/sqlite/connection';
import { CreateLogDTO } from './dto/create.log.dto';
import { SchemaInterface } from '@src/schema/list.schema';

interface ListInterface extends Pick<SchemaInterface, 'order' | 'date' | 'filters'> {
  page: number;
  limit: number;
}

export class LogRepository {
  max_columns = 20000;

  constructor(
    private readonly prisma: PrismaClient | PrismaTransactionalClient
  ) {}

  static getInstance() {
    return new LogRepository(prisma);
  }

  static transaction(trx: PrismaTransactionalClient) {
    return new LogRepository(trx);
  }

  async getCountLogsTemp() {
    return this.prisma.log.count({ where: { is_temp: true } });
  }

  async listMany(params: ListInterface) {
    const { page, limit, order, filters } = params;

    const whereObject =  this.whereList(String(filters));
    const items = await this.prisma.log.findMany({
      ...whereObject,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: order || 'asc',
      },
    });

    const totalItems = await prisma.log.count(whereObject);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      total_items: totalItems,
      total_pages: totalPages,
      items,
    };
  }

  private whereList(filters: string) {
    const whereObject: any = {

    };

    if (filters.length && this.isFiltersQuery(filters)) {
      const { instance_error, status, message, is_temp } = JSON.parse(
        String(filters)
      );

      if (instance_error) whereObject.where = { instance_error };
      if (status) whereObject.where = { status };
      if (message) whereObject.where = { message };
      if (is_temp) whereObject.where = { is_temp };
    }

    return whereObject;
  }

  private isFiltersQuery(filters: string) {
    try {
      return !!(JSON.parse(filters));
    } catch {
      return false;
    }
  }
  async create(data: CreateLogDTO) {
    return this.prisma.log.create({
      data,
    });
  }

  async createMany(data: CreateLogDTO[]) {
    return this.prisma.log.createMany({
      data,
    });
  }
  async deleteLogsExpired() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return this.prisma.log.deleteMany({
      where: {
        is_temp: true,
        created_at: { lte: oneYearAgo },
      },
    });
  }

  async deleteLogsTempLimitColumns() {
    const totalColumns = await this.getCountLogsTemp();
    if (totalColumns > this.max_columns) {
      const numberExtraColumns = totalColumns - this.max_columns;

      const lastLogs = await this.prisma.log.findMany({
        where: { is_temp: true },
        take: numberExtraColumns,
        orderBy: { created_at: 'desc' },
        select: { id: true },
      });

      const ids = lastLogs.map((log) => log.id);

      await this.prisma.log.deleteMany({ where: { id: { in: ids } } });
    }
  }
}

export default LogRepository.getInstance();
