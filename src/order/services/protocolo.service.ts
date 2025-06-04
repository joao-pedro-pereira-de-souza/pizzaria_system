import { CreateOrderTempDto } from '../dtos/orders.temp.dto';
import OrdersTempRepository from '../repositories/orders.temp.repository';

export class ProtocoloOrderService {
  static async save(data: CreateOrderTempDto) {

    const orders = await OrdersTempRepository.getByFrom(data.from);
    const messages: any = [];

    if (orders) {
      messages.push(...orders);
    }

    messages.push(...data.messages);
    return await OrdersTempRepository.create({
      from: data.from,
      messages
    });

  }
}
