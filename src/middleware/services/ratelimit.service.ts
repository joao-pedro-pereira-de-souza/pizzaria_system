import { Router, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

export class RateLimitedMiddlewareService {
  static unlimitedEnvironments = ['development', 'test'];

  static inicialize(app: Router) {
    app.use(this.#getRateLimit());
  }

  static #getRateLimit() {
    return rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_TIME),
      limit: Number(process.env.RATE_LIMIT_LIMIT_REQUESTS),
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      handler: this.#handler,
    });
  }

  static #handler(req: Request, res: Response) {
    const response = {
      status: 429,
      message: 'Limite de taxa excedido. Tente novamente mais tarde.',
      data: null,
    };
    return res.status(response.status).json(response);
  }
}
