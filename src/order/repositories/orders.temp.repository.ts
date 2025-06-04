
import { RedisModule } from '@src/redis/redis.module';
import { CreateOrderTempDto, MessagesDto  } from '../dtos/orders.temp.dto';


export class OrdersTempRepository {
  name_space = 'orders_temp';
  expired_minutes = 15;

  constructor(private readonly redisModule: RedisModule) {}

  static instance() {
    const redisModule = new RedisModule();

    return new OrdersTempRepository(redisModule);
  }

  async create(data: CreateOrderTempDto) {
    const key = `${this.name_space}:${data.from}`;
    const expired = 60 * this.expired_minutes;

    return this.redisModule.client?.set(key, JSON.stringify(data.messages), {
      expiration: {
        type: 'EX',
        value: expired,
      },
    });
  }

  async getByFrom(from: string) {
    const key = `${this.name_space}:${from}`;
    const value = await this.redisModule.client?.get(key);

    return value ? (JSON.parse(value) as MessagesDto) : null;
  }
}

export default OrdersTempRepository.instance();
