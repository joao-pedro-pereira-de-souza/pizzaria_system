import express, { Express } from 'express';
import { WelcomeController } from './welcome.controller';

export class WelcomeRoutes {
  static #prefix = '/welcome';

  static inicialize(app: Express) {
    const router = express.Router();

    router.get('/', new WelcomeController().execute);
    app.use(this.#prefix, router);
  }
}
