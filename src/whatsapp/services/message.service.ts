

import OrdersTempRepository from '@src/order/repositories/orders.temp.repository';
import { StartMessageUsecase } from '../usecases/message.start.usecase';
import { FormStartSelectedUsecase } from '../usecases/message.form.start.select.usecase';
import { ResponseButton } from '@src/whatsapp/dtos/whatsapp.response.message.dto';



export class MessageAlgorithmService {

  constructor(private readonly to: string) {

  }

  async response() {
    const getHistoryMessages = await OrdersTempRepository.getByFrom(this.to);

    const isMessageStart = !getHistoryMessages || getHistoryMessages.some((item)=> item.sendertype === 'enterprise');
    if (isMessageStart) {
      return StartMessageUsecase.usecase();
    }

    const lastMessage = getHistoryMessages.pop();
    const isMessageFormStartSelect =
      lastMessage?.sendertype === 'customer' &&
      'button' in lastMessage &&
      lastMessage.type === FormStartSelectedUsecase.model_template;

    if (isMessageFormStartSelect) {

      return lastMessage;

    }

  }
}
