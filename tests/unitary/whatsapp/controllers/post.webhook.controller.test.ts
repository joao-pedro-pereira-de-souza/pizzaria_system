import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
} from '@jest/globals';
import { Request, Response } from 'express';
import { CreateMockModuleRedis } from '../../../mocks/redis.module';


describe('#whatsapp/controllers/post.webhook.controller.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    CreateMockModuleRedis();
  });

  it('should not return message in case entry.changes[0].field is different from messages', async () => {

    const bodyNotSendMessage = {
      'object': 'whatsapp_business_account',
      'entry': [
        {
          'id': '123456789012345',
          'changes': [
            {
              'value': {
                'messaging_product': 'whatsapp',
                'metadata': {
                  'display_phone_number': '15551234567',
                  'phone_number_id': '123456789012345'
                },
                'contacts': [
                  {
                    'profile': {
                      'name': 'João Souza'
                    },
                    'wa_id': '5511999999999'
                  }
                ],
                'messages': [
                  {
                    'context': {
                      'from': '15551773246',
                      'id': 'wamid.HBgNNTUxMTk0MTA1MjgyMBUCABEYEjg3OTUxQUJGMjc1QzUxQ0QxNgA='
                    },
                    'from': '5511999999999',
                    'id': 'wamid.HBgNNTUxMTk0MTA1MjgyMBUCABIYFjNFQjAzRjNFNkQ5OTkxMDEyMDZEMEYA',
                    'timestamp': '1748400522',
                    'type': 'button',
                    'button': {
                      'payload': 'FALAR_COM_ATENDENTE',
                      'text': 'Falar com um atendente'
                    }
                  }
                ]
              },
              'field': null
            }
          ]
        }
      ]

    };

    const MockProtocoloOrderService = {
      save: jest.fn()
    };


    jest.mock('@src/order/services/protocolo.service', () => {
      return {
        ProtocoloOrderService: MockProtocoloOrderService
      };
    });


    const { PostWebhookController } = await import('@src/whatsapp/controllers/post.webhook.controller');
    const postWebhookController = new PostWebhookController();

    const postWebhookControllerSpyon = jest.spyOn(postWebhookController, 'execute');

    const mockRequest = {
      body: bodyNotSendMessage
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const mockNext = jest.fn();

    await postWebhookController.execute(mockRequest, mockResponse, mockNext);


    expect(MockProtocoloOrderService.save).toHaveBeenCalledTimes(0);
    const expectedResponse: any = await postWebhookControllerSpyon.mock.results[0].value;

    expect( expectedResponse.status.mock.calls[0][0]).toEqual(200);

  });

  it('should not return message in case entry.changes[0].messages is array empty or null', async () => {

    const bodyNotSendMessage = {
      'object': 'whatsapp_business_account',
      'entry': [
        {
          'id': '123456789012345',
          'changes': [
            {
              'value': {
                'messaging_product': 'whatsapp',
                'metadata': {
                  'display_phone_number': '15551234567',
                  'phone_number_id': '123456789012345'
                },
                'contacts': [
                  {
                    'profile': {
                      'name': 'João Souza'
                    },
                    'wa_id': '5511999999999'
                  }
                ],
                'messages': []
              },
              'field': 'messages'
            }
          ]
        }
      ]

    };

    const MockProtocoloOrderService = {
      save: jest.fn()
    };


    jest.mock('@src/order/services/protocolo.service', () => {
      return {
        ProtocoloOrderService: MockProtocoloOrderService
      };
    });


    const { PostWebhookController } = await import('@src/whatsapp/controllers/post.webhook.controller');
    const postWebhookController = new PostWebhookController();

    const postWebhookControllerSpyon = jest.spyOn(postWebhookController, 'execute');

    const mockRequest = {
      body: bodyNotSendMessage
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const mockNext = jest.fn();

    await postWebhookController.execute(mockRequest, mockResponse, mockNext);


    expect(MockProtocoloOrderService.save).toHaveBeenCalledTimes(0);
    const expectedResponse: any = await postWebhookControllerSpyon.mock.results[0].value;

    expect( expectedResponse.status.mock.calls[0][0]).toEqual(200);

  });

});
