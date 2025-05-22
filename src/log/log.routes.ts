

import express, { Express } from 'express';
import { ListLogsController } from './controllers/list.controller';

export class LogsRoutes {
  static #prefix = '/logs';


  static inicialize(app: Express) {
    const router = express.Router();

    router.get('/', new ListLogsController().execute);
    app.use(this.#prefix, router);
  }
}
