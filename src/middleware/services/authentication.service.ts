import { Request, Response, NextFunction } from 'express';
import { CookieService } from '@security/services/cookie.service';
import { TokenService } from '@security/services/token.service';
import { NotFoundError, AuthenticationError } from '@error/erros.mudule';

import UsersRepository from '@root/src/user/user.repository';
import { User } from '@prisma/postgresql/generated/postgresql';
import PermissionsRepository from '@root/src/permission/permission.repository';

export class AuthenticationMiddleware {
  static inicialize(permissions?: number[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

      try {
        const instanceCookieService = CookieService.instance(req, 'auth');

        let token;
        try {
          token = instanceCookieService.getCookieSigned();
        } catch (error: any) {
          throw new NotFoundError(error?.message || 'Token não encontrado.');
        }

        const [bearer, hash] = String(token).split(' ');

        if (!bearer || !hash) {
          const response = {
            status: 401,
            message: 'Token mal formatado.',
          };

          return res.status(response.status).json(response);
        }

        const user = await AuthenticationMiddleware.validationAccountToken(
          hash,
          instanceCookieService,
          res
        );

        await AuthenticationMiddleware.validationPermission(user, permissions);
      } catch (error) {
        next(error);
      }

      next();
    };
  }

  private static async validationAccountToken(
    hash_token: string,
    instanceCookieService: CookieService,
    res: Response
  ) {
    const { email, id }: any = TokenService.verify(hash_token);
    if (!email || !id) {
      instanceCookieService.delete(res);
      throw new AuthenticationError('Os dados do token está incorreto.');
    }

    const user = await UsersRepository.findUserByEmail(email);
    if (!user) {
      instanceCookieService.delete(res);
      throw new NotFoundError(
        'Sua conta não foi encontrada, entre na tela de login e tente novamente.'
      );
    }

    if (user.id !== id) {
      instanceCookieService.delete(res);
      throw new NotFoundError(
        'Não conseguimos identificar sua conta, entre na tela de login e tente novamente.'
      );
    }

    return user;
  }

  private static async validationPermission(user: User, permissions?: number[] ) {

    if (permissions && permissions.length) {
      const listPermissions = await PermissionsRepository.findManyNumbers(
        permissions
      );

      const isAccessPermission = listPermissions.some(
        (permission) => permission.id === user.id_permission
      );
      if (!isAccessPermission) {
        throw new AuthenticationError('Voce não tem permissão de acesso.');
      }
    }
  }

  static getMetadadosToken(req: Request) {
    const instanceCookieService = CookieService.instance(req, 'auth');

    const token = instanceCookieService.getCookieSigned();
    const [, hash] = String(token).split(' ');
    return TokenService.verify(hash);
  }
}
