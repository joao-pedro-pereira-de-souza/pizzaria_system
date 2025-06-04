export type OptionsSelected = "FAZER_PEDIDO_COM_BOT" | "FAZER_PEDIDO_COM_ATENDENTE";

export class FormOderUsecase {
  static model_template = "option_order";

  constructor(private readonly type_selected: OptionsSelected) {}

  usecase() {
    if (this.type_selected === "FAZER_PEDIDO_COM_BOT") {
      const textResponse =
        "Verifique as opções do cardápio,";
      return {
        response: {
          type: "text",
          text: {
            body: textResponse,
          },
        },
      };
    }

    if (this.type_selected === "FAZER_PEDIDO_COM_ATENDENTE") {
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
