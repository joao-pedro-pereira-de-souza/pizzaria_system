
export type OptionsSelected = "FAZER_PEDIDO" | "FALAR_COM_ATENDENTE";

export class FormStartSelectedUsecase {
  static model_template = "start_message";

  constructor(private readonly type_selected: OptionsSelected) {}

  usecase() {
    if (this.type_selected === "FAZER_PEDIDO") {
      return {
        response: {
          type: "template",
          template: {
            name: FormStartSelectedUsecase.model_template,
            language: {
              code: "pt_BR",
            },
            components: [
              {
                type: "button",
                sub_type: "quick_reply",
                index: "0",
                parameters: [
                  {
                    type: "payload",
                    payload: "FAZER_PEDIDO",
                  },
                ],
              },
              {
                type: "button",
                sub_type: "quick_reply",
                index: "1",
                parameters: [
                  {
                    type: "payload",
                    payload: "FALAR_COM_ATENDENTE",
                  },
                ],
              },
            ],
          },
        },
      };
    }

    if (this.type_selected === "FALAR_COM_ATENDENTE") {
      const textResponse =
        "Aguarde um momento, estamos transferindo a conversa para um atendente.";
      return {
        response: {
          type: "text",
          text: {
            body: textResponse,
          },
        },
      };
    }
  }
}
