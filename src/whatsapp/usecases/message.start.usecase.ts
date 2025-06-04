
export class StartMessageUsecase {
  static model_template = 'start_message';

  static usecase() {
    return {
      response: {
        template: {
          name: StartMessageUsecase.model_template,
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
      },
    };
  }
}
