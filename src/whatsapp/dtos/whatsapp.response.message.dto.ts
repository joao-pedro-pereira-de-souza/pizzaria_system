
export type MessagesDto = (ResponseText | ResponseButton)[];
export interface ResponseText {
  from: string;
  id: string;
  timestamp: string;
  text: Text;
  type: string;
}

 interface Text {
  body: string;
}

export interface ResponseButton {
  context: Context;
  from: string;
  id: string;
  timestamp: string;
  type: string;
  button: Button;
}

interface Context {
  from: string;
  id: string;
}

interface Button {
  payload: string;
  text: string;
}
