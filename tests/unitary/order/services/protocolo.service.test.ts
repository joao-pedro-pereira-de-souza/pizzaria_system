import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';

import { CreateMockModuleRedis } from '../../../mocks/redis.module';
import MockRequestWhatsappJson from '../../../mocks/example_request_whatsapp_post_webhook.json';
import { MessagesDto } from '@src/order/dtos/orders.temp.dto';
import { response_text } from '../../../mocks/webhookMessagesPost.json';

describe('#order/service/protocolo.service.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    CreateMockModuleRedis();
  });


  it('should save all messages protocolo server', async () => {


    const mockDataProtocol = [{
      ...MockRequestWhatsappJson.entry?.[0].changes?.[0].value?.messages[0],
      sendertype: 'customer',

    }] as MessagesDto;


    const mockOrderRepository = {
      getByFrom: jest.fn(() => mockDataProtocol),
      create: jest.fn()
    };

    jest.mock('@src/order/repositories/orders.temp.repository', () => {
      return {
        __esModule: true,
        default: mockOrderRepository
      };
    });

    const { ProtocoloOrderService } = await import('@src/order/services/protocolo.service');

    const protocoloOrderServiceSpyon = jest.spyOn(ProtocoloOrderService, 'save');

    const entry = MockRequestWhatsappJson.entry[0];
    const changes = entry.changes[0];
    const message = changes.value.messages[0];

    const phone_from = message.from;

    delete (message as any).button;

    const dataMessageSave = [{
      ...message,
      sendertype: 'customer', text: {
        ...response_text,
        body: JSON.stringify(response_text.text)
      }
    }];
    await ProtocoloOrderService.save({
      from: phone_from,
      messages: dataMessageSave as any
    });


    const callsProtocoloSave = protocoloOrderServiceSpyon.mock.calls;

    expect(callsProtocoloSave[0][0].from).toEqual(phone_from);
    expect(callsProtocoloSave[0][0].messages).toEqual(dataMessageSave);

    const clallsCreateOrderRepository :any = mockOrderRepository.create.mock.calls[0][0];
    const allMessages = [...mockDataProtocol, ...dataMessageSave];

    expect(clallsCreateOrderRepository.from).toEqual(phone_from);
    expect(clallsCreateOrderRepository.messages).toEqual(allMessages);
  });


});
