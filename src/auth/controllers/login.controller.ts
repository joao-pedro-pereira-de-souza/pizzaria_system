import { Request, Response, NextFunction } from 'express';
import {
  schema,
  schemaInterface as BodyLoginInterface,
} from '../schemas/login.schema';
import { validationSchemaService } from '@root/src/schema/validation.schema.service';
import UsersRepository from '@root/src/user/user.repository';
import { CryptoService } from '@root/src/security/services/crypto.service';
import { TokenService } from '@root/src/security/services/token.service';
import { CookieService } from '@root/src/security/services/cookie.service';
import {
  UnprocessableEntityError,
  NotFoundError,
  AuthenticationError,
  HandleInstanceError,
} from '@root/src/error/erros.mudule';

export class LoginAuthController {
  static async execute(
    req: Request<any, any, BodyLoginInterface, any>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const validation = validationSchemaService.validation(schema, req.body);
      if (!validation.success) {
        throw new UnprocessableEntityError('Dados inválidos', validation.data);
      }

      const emailFormatted = req.body.email.toLowerCase();
      const user = await UsersRepository.findUserByEmail(emailFormatted);

      if (!user) throw new NotFoundError('Usuário não encontrado.');

      const comparePassword = CryptoService.compare(
        req.body.password,
        user.password
      );

      if (!comparePassword) throw new AuthenticationError('Senha incorreta.');

      const token = TokenService.sign({
        data: { id: user.id, email: user.email },
      });

      const instanceCookieService = CookieService.instance(req, 'auth');
      instanceCookieService.set(`Bearer ${token}`, res);

      delete (user as any).password;

      const respose = {
        status: 200,
        items: user,
      };
      return res.status(respose.status).json(respose);
    } catch (error) {
      const instanceError = HandleInstanceError(error);
      if (instanceError) {
        return res.status(instanceError.status).json(instanceError);
      }

      next(error);
    }
  }
}
