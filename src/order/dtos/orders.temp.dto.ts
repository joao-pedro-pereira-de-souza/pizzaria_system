import {
  ResponseText,
  ResponseButton,
} from "@src/whatsapp/dtos/whatsapp.response.message.dto";
import { WhatsappPostMessageDto } from "@src/whatsapp/dtos/whatsapp.repository.dto";

type EnumSenderType = "customer" | "enterprise";

export interface ResponseTextOrderTemp extends ResponseText {
  sendertype: EnumSenderType;
}

export interface ResponseButtonOrderTemp extends ResponseButton {
  sendertype: EnumSenderType;
}

export interface ResponseEnterprise extends WhatsappPostMessageDto {
  sendertype: EnumSenderType;
}

export type MessagesDto = (
  | ResponseTextOrderTemp
  | ResponseButtonOrderTemp
  | ResponseEnterprise
)[];

export interface CreateOrderTempDto {
  from: string;
  messages: MessagesDto;
}
