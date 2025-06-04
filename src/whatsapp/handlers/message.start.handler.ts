import { MessagesDto } from '@src/order/dtos/orders.temp.dto'
import { MessageHandler } from './message.handler'
import { StartMessageUsecase } from "../usecases/message.start.usecase";

export class MessageStartHandler implements MessageHandler {

   canHandle(history?: MessagesDto): boolean {
      return (
        !history || history.some((item) => item.sendertype === "enterprise")
      );
   }

   handle() {
      return StartMessageUsecase.usecase();
   }
}
