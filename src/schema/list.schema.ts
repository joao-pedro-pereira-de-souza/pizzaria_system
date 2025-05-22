import { z } from 'zod';
import regex from '@src/util/regex';
import util from 'util';

export function ConvertStringify(filters: string): object | boolean {
  try {
    const objectFilter: object = JSON.parse(filters);
    return objectFilter;
  } catch (error: any) {
    return false;
  }
}

export const schema = z
  .object({
    page: z
      .string({
        invalid_type_error: 'Selecione o número da página corretamente.',
      })
      .regex(/^\d+$/).optional(),

    limit: z
      .string({
        invalid_type_error: 'Selecione o limite da página corretamente.',
      })
      .regex(/^\d+$/).optional(),

    search_txt: z
      .string({
        invalid_type_error: 'Digite a pesquisa corretamente.',
      })
      .optional(),

    order: z
      .enum(['asc', 'desc'], {
        invalid_type_error: 'Selecione a ordem corretamente.',
      })
      .optional(),

    filters: z
      .custom((value: string) => {
        const regexObjectOrArray = /^[\],:{}\s]*$/;
        const regexKeys =
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g;
        const regexKeysClear = /(?:^|:|,)(?:\s*\[)+/g;

        if (
          !regexObjectOrArray.test(
            value
              .replace(/\\["\\\bfnrtu]/g, '@')
              .replace(regexKeys, ']')
              .replace(regexKeysClear, '')
          )
        ) {
          return false;
        }

        const objectFilters = ConvertStringify(value);

        if (!objectFilters) {
          return false;
        }

        return true;
      }, 'Filtros enviado no formato errado, tente novamente no formato object ou array stringify.')
      .optional(),

    date_start: z
      .custom((value: string) => {
        const isDate =
          regex.date.test(value) ||
          regex.dateTime.test(value) ||
          regex.timestamp.test(value) ||
          util.types.isDate(value);
        return isDate;
      }, 'Selecione a data inicial corretamente.')
      .optional(),

    date_end: z
      .custom((value: string) => {
        const isDate =
          regex.date.test(value) ||
          regex.dateTime.test(value) ||
          regex.timestamp.test(value) ||
          util.types.isDate(value);
        return isDate;
      }, 'Selecione a data final corretamente.')
      .optional(),

    date: z
      .custom((value: string) => {
        const isDate = regex.date.test(value);
        return isDate;
      }, 'Selecione a data corretamente.')
      .optional(),
  })
  .refine(
    (schema) => {
      return schema.date_start || schema.date_end
        ? !!(schema.date_start && schema.date_end)
        : true;
    },
    {
      message: 'O filtro de período precisa ter as duas datas.',
    }
  );

export type SchemaInterface = z.infer<typeof schema>;
