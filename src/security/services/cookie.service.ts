import { Response, Request, CookieOptions } from 'express';


export class CookieService {
  private constructor(
    private readonly req: Request,
    private readonly key: string
  ) {}

  static instance(req: Request, key: string) {
    return new CookieService(req, key);
  }

  set(value: string, res: Response) {
    const options: CookieOptions = {
      httpOnly: true,
      signed: true,
      path: '/',
      maxAge: 7 * 86400000,
      sameSite: 'strict',
    };

    if (process.env.NODE_ENV === 'production') {
      options.domain = process.env.DOMAIN_API;
      options.secure = true;
    }

    res.cookie(this.key, value, options);
  }

  getCookieSigned() {
    const signedCookie = this.req.signedCookies[this.key];

    if (!signedCookie) {
      throw new Error('Cookie not signed');
    }

    return signedCookie;
  }

  delete(res: Response) {
    const options: CookieOptions = {
      path: '/',
      signed: true,
      sameSite: 'strict',
    };

    if (process.env.NODE_ENV === 'production') {
      options.domain = process.env.DOMAIN_API;
      options.secure = true;
    }

    res.clearCookie(this.key, options);
  }
}
