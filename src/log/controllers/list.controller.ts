
import { Request, Response, NextFunction } from 'express';
import { schema, SchemaInterface } from '@src/schema/list.schema';
import { validationSchemaService } from '@src/schema/validation.schema.service';
import { UnprocessableEntityError } from '@error/erros.mudule';
import logRepository from '../log.repository';


export class ListLogsController {
  async execute(
    req: Request<any, any, any, SchemaInterface>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {

      const validation = validationSchemaService.validation(schema, req.query);
      if (!validation.success) {
        throw new UnprocessableEntityError('Dados inválido', validation.data);
      }

      const query = req.query;
      const response = await logRepository.listMany({
        ...req.query,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
      });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
