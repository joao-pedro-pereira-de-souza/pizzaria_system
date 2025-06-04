import {MessagesDto} from '@src/order/dtos/orders.temp.dto'

export interface MessageHandler {
  canHandle(): boolean;
  handle(): Promise<any> | any;
}
