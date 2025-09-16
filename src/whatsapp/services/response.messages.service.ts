import WhatsappRepository from '../repositories/whatsapp.repository';
import { WhatsappPostMessageDto } from '../dtos/whatsapp.repository.dto';
import { MessagesDto } from '../dtos/whatsapp.response.message.dto';
import OrdersTempRepository from '@src/order/repositories/orders.temp.repository';
import { ProtocoloOrderService } from '@src/order/services/protocolo.service';

type ResponseMessagesData = Pick<WhatsappPostMessageDto, 'to'>;

interface ResponseMessagesServiceArgs {
  data: ResponseMessagesData;
}
export class ResponseMessagesServices {
  constructor(private readonly args: ResponseMessagesServiceArgs) {}

  async response() {
    const { data } = this.args;

    const getHistoryMessages = await OrdersTempRepository.getByFrom(data.to);

    const dataBodyResponse: WhatsappPostMessageDto = {
      ...data,
      type: 'template',
      messaging_product: 'whatsapp',
      template: {
        name: 'start_message',
        language: {
          code: 'pt_BR',
        },
        components: [
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              {
                type: 'payload',
                payload: 'FAZER_PEDIDO',
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '1',
            parameters: [
              {
                type: 'payload',
                payload: 'FALAR_COM_ATENDENTE',
              },
            ],
          },
        ],
      },
    };

    await ProtocoloOrderService.save({
      from: dataBodyResponse.to,
      messages: [{ ...dataBodyResponse, sendertype: 'enterprise' }],
    });

    await WhatsappRepository.sendMessage(dataBodyResponse);
  }

  usecase(messages?: MessagesDto) {

  }
}
