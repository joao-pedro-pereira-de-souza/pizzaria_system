import { MessagesDto, ResponseButtonOrderTemp } from '@src/order/dtos/orders.temp.dto'
import { MessageHandler } from './message.handler'
import { FormStartSelectedUsecase, OptionsSelected } from "../usecases/message.form.start.select.usecase";



export class MessageFormStartSelectHandler implements MessageHandler {


  constructor(readonly history: MessagesDto) {}

  canHandle(): boolean {
    if (!this.history) return false;

    const lastMessage = this.history.pop();
    return !!(
      lastMessage &&
      lastMessage.sendertype === "customer" &&
      "button" in lastMessage &&
      lastMessage.type === FormStartSelectedUsecase.model_template
    );
  }

   handle() {
     const lastMessage = this.history.pop() as ResponseButtonOrderTemp;
     const formStartSelectedUsecase = new FormStartSelectedUsecase(
       lastMessage.button.payload as OptionsSelected
     );
      return formStartSelectedUsecase.usecase();
  }
}
