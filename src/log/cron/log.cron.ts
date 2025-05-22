
import cron from 'node-cron';
import { LogScheduleService } from '../services/log.schedule.service';

export class LogCron {
  static schedules() {
    const logScheduleService = new LogScheduleService();

    const cronSchedule = '0 0 5 * *';

    cron.schedule(cronSchedule, logScheduleService.clear, {
      scheduled: true,
      timezone: 'America/Sao_Paulo',
    });
  }
}
