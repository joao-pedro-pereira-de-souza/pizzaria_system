
import logRepository from '../log.repository';

export interface SaveLogInterface {
  status: number;
  message: string;
  detais: string;
  instance_error: string;
}
export class LogService {
  static async save(data: SaveLogInterface) {
    logRepository.create(data);
  }


  async clear() {
    await logRepository.deleteLogsExpired();
    await logRepository.deleteLogsTempLimitColumns();
  }
}
