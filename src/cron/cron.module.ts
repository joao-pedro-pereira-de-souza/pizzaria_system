import { LogCron } from '@root/src/log/cron/log.cron';
export class CronModule {
  static inicialize() {
    LogCron.schedules();
  }
}
