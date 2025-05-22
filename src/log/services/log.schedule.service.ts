

import logRepository from '../log.repository';

export class LogScheduleService {

  async clear() {
    await logRepository.deleteLogsExpired();
    await logRepository.deleteLogsTempLimitColumns();
  }
}
