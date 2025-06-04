
import axios from 'axios';
import { AxiosRequestServiceError, InternalServerError } from '@error/erros.mudule';
import { WhatsappPostMessageDto } from '../dtos/whatsapp.repository.dto';

export class WhatsappRepository {
  axios_base;
  constructor() {
    this.axios_base = axios.create({
      baseURL: `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_META_PHONE_NUMBER_ID}`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(data: WhatsappPostMessageDto) {
    try {
      const response = await this.axios_base.post('/messages', JSON.stringify(data));
      if (response.status !== 200) {
        throw new AxiosRequestServiceError(
          'Ocorreu um erro ao responder o cliente',
          response
        );
      }


    } catch (error) {
      throw new InternalServerError(
        'Ocorreu um erro inesperado no método sendMessage no repositório whatsapp',
        error
      );
    }
  }
}


export default new WhatsappRepository();
