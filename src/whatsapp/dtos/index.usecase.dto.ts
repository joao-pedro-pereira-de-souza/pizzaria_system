import { ResponseButton, ResponseText } from './whatsapp.response.message.dto';
export interface DataResponseUseCase {
  list_chat: (ResponseText | ResponseButton)[]
}
