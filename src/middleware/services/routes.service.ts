import { Express } from 'express';
import { WelcomeRoutes } from '../../welcome/welcome.routes';
import { LogsRoutes } from '../../log/log.routes';
import { AuthRoutes } from '../../auth/auth.routes';
import { WhatsappRoutes } from '@root/src/whatsapp/whatsapp.routes';
export class RoutesMiddlewareService {
  static inicialize(app: Express) {
    WelcomeRoutes.inicialize(app);
    LogsRoutes.inicialize(app);
    AuthRoutes.inicialize(app);
    WhatsappRoutes.inicialize(app);
  }
}
