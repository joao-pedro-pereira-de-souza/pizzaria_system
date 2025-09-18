import { Request, Response, NextFunction } from 'express';
import { ResponseMessagesServices } from '@root/src/whatsapp/services/response.messages.service';
// import OrdersTempRepository  from '@src/order/repositories/orders.temp.repository';

import { ProtocoloOrderService } from '@src/order/services/protocolo.service';


export class PostWebhookController {
  async execute(
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {


      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const message = changes?.value?.messages?.[0];

      if (message && changes?.field === 'messages') {
        const phone_from = message.from;

        await ProtocoloOrderService.save({
          from: phone_from,
          messages: [{ ...message, sendertype: 'customer' }],
        });


        const responseMessagesServices = new ResponseMessagesServices({
          data: {
            to: phone_from,
          },
        });

        responseMessagesServices.response();
      }

      return res.status(200).send();

    } catch (error) {
      next(error);
    }
  }
}
