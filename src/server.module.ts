import { AppServer } from './app.module';
import { CronModule } from './cron/cron.module';

export class ServerModule {

  static async inicialize() {
    const instanceApp = AppServer.getInstance();
    const server = instanceApp.inicialize();

    CronModule.inicialize();

    return {
      server,
    };
  }
}

export const serverInicialize = ServerModule.inicialize();
