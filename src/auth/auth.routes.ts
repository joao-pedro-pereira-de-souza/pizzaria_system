import { Express, Router } from 'express';
import { LoginAuthController } from './controllers/login.controller';
export class AuthRoutes {
  static #prefix = '/auth';

  static inicialize(app: Express) {
    const router = Router();

    router.post('/login', LoginAuthController.execute);
    app.use(this.#prefix, router);
  }
}
