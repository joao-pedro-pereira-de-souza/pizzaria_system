import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import pino from 'pino';
import Http, { Server } from 'http';

import { RoutesMiddlewareService } from '@middleware/services/routes.service';

import { RateLimitedMiddlewareService } from '@middleware/services/ratelimit.service';
import { ErrorMiddlewareService } from '@root/src/middleware/services/error.service';

export class AppServer {
  constructor(public readonly app: Express, public readonly http: Server) {}

  static getInstance() {
    const app = express();

    app.use(express.json());

    app.use(
      cors({
        credentials: true,
        allowedHeaders: ['content-type'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        origin: true,
      })
    );

    app.use(cookieParser(process.env.SIGNATURE_COOKIE));

    app.use(
      '/uploads',
      express.static(path.join(__dirname, '../', 'uploads', 'public'))
    );

    AppServer.loggerRequest(app);

    if (
      !RateLimitedMiddlewareService.unlimitedEnvironments.includes(
        String(process.env.NODE_ENV)
      )
    ) {
      RateLimitedMiddlewareService.inicialize(app);
    }

    RoutesMiddlewareService.inicialize(app);
    ErrorMiddlewareService.inicialize(app);

    const http = Http.createServer(app);
    return new AppServer(app, http);
  }

  private static loggerRequest(app: Express) {
    const logger = pino({
      level: 'info',
    });
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`);

      next();
    });
  }
  #listenerCallback() {
    console.log('Server listening on ✅');
  }

  inicialize(): Server | void {
    if (process.env.NODE_ENV !== 'test') {

      const PORT = Number(process.env.PORT) || 3972;
      return this.http.listen(PORT, () => this.#listenerCallback());
    }
  }
}
