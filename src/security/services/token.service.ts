import jwt from 'jsonwebtoken';


interface SignParams {
  expiresIn?: string;
  data: object;
}

export class TokenService {
  private static catchVerify(error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token JWT inválido');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token JWT ainda não é válido');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token JWT expirado');
    } else {
      throw new Error('Erro ao validar token JWT');
    }
  }

  static verify(token: string) {
    try {
      return jwt.verify(token, String(process.env.JWT_SECURITY));
    } catch (error) {
      this.catchVerify(error);
    }
  }

  static sign(params: SignParams) {
    return jwt.sign(params.data, String(process.env.JWT_SECURITY), { expiresIn: params.expiresIn || '7days' });
  }

}
