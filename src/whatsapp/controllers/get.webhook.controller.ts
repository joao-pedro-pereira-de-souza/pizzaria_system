import { Request, Response, NextFunction } from 'express';

export class GetWebhookController {
  async execute(
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      const { WHATSAPP_META_VERIFY_TOKEN } = process.env;

      if (mode === 'subscribe' && token === WHATSAPP_META_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
      } else {
        return res.status(403);
      }
    } catch (error) {
      next(error);
    }
  }
}
