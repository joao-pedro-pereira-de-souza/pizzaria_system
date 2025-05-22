import { Schema, ZodError } from 'zod';

export class validationSchemaService {
  static validation(schema: Schema, values: unknown) {
    try {
      const data = schema.parse(values);
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const { issues } = error;
        return {
          success: false,
          data: issues,
        };
      }

      return {
        success: false,
        message: 'Preencha os dados corretamente.',
      };
    }
  }
}
