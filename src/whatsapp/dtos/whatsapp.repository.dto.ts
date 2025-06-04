export interface WhatsappPostMessageDto {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'image' | 'document' | 'template' | 'interactive';
  text?: {
    body: string;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    filename?: string;
    caption?: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
     components?: any[];
  };
}
