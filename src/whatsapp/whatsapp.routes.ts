import express, { Express } from 'express';
import { GetWebhookController } from './controllers/get.webhook.controller';
import { PostWebhookController } from './controllers/post.webhook.controller';

export class WhatsappRoutes {
  static #prefix = '/whatsapp';

  static inicialize(app: Express) {
    const router = express.Router();

    router.get('/webhook', new GetWebhookController().execute);
    router.post('/webhook', new PostWebhookController().execute);


    app.use(this.#prefix, router);
  }
}
