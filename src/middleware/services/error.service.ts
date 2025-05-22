import { Express, Request, Response, NextFunction } from 'express';
import { HandleInstanceError, allInstancesErrors } from '@error/erros.mudule';
import { LogService } from '@root/src/log/services/log.service';

export class ErrorMiddlewareService {
  static inicialize(app: Express): void {
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      if (error) {
        console.info(error);
        if (error?.message.includes('multer error')) {
          const message = error.message.split(':')[1];

          const response = {
            status: 404,
            message,
          };
          return res.status(response.status).json(response);
        }

        const instance = allInstancesErrors.find((instance) => error instanceof instance);

        const dataSaveLog = {
          status: (error as any)?.status ?? 503,
          message: (error as any)?.message || 'Internal Server Error',
          detais: JSON.stringify(error),
          instance_error: instance?.name || 'InternalServerError',
        };

        LogService.save(dataSaveLog);
        const response = HandleInstanceError(error);
        return res.status(response.status).json(response);
      }

      next();
    });
  }

}
