
import { createClient } from 'redis';
import { InternalServerError } from '@error/erros.mudule';
export class RedisModule {
  static instance: RedisModule;

  client;
  constructor() {
    if (RedisModule.instance) {
      return RedisModule.instance;
    }

    this.client = createClient({
      socket: {
        host: process.env.DB_REDIS_HOST,
        port: Number(process.env.DB_REDIS_PORT),
      },
      password: process.env.DB_REDIS_PASSWORD,
    });

    this.client.on('error', () => {

      console.log('---> error redis <-----');
      throw new InternalServerError('Ocorreu um erro ao conectar no redis');
    });

    this.client.on('connection', () => {
      console.log('---> error redis <-----');
      throw new InternalServerError('Ocorreu um erro ao conectar no redis');
    });

    this.client.connect();

    RedisModule.instance = this;
  }
}
