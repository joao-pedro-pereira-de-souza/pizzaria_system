import { describe, it, expect, jest } from '@jest/globals';
import { Request } from 'express';

describe('security/services/cookie.service.ts', () => {
  it('should set cookie production', async () => {
    const NODE_ENV = 'production';
    const DOMAIN_API = 'http://localhost:8080';

    process.env.NODE_ENV = NODE_ENV;
    process.env.DOMAIN_API = DOMAIN_API;

    const mockRequest = {} as Request;
    const mockResponse = {
      cookie: jest.fn(),
    } as any;
    const key = 'auth';

    const { CookieService } = await import(
      '@security/services/cookie.service'
    );
    const instance = CookieService.instance(mockRequest, key);

    const value = 'teste auth';
    instance.set(value, mockResponse);

    expect(mockResponse.cookie).toHaveBeenNthCalledWith(1, key, value, {
      domain: DOMAIN_API,
      httpOnly: true,
      maxAge: 604800000,
      path: '/',
      sameSite: 'strict',
      secure: true,
      signed: true,
    });
  });

  it('should set cookie development', async () => {
    const NODE_ENV = 'development';
    const DOMAIN_API = 'http://localhost:8080';

    process.env.NODE_ENV = NODE_ENV;
    process.env.DOMAIN_API = DOMAIN_API;

    const mockRequest = {} as Request;
    const mockResponse = {
      cookie: jest.fn(),
    } as any;
    const key = 'auth';

    const { CookieService } = await import(
      '@security/services/cookie.service'
    );
    const instance = CookieService.instance(mockRequest, key);

    const value = 'teste auth';
    instance.set(value, mockResponse);

    expect(mockResponse.cookie).toHaveBeenNthCalledWith(1, key, value, {
      httpOnly: true,
      maxAge: 604800000,
      path: '/',
      sameSite: 'strict',
      signed: true,
    });
  });

  it('should getCookieSigned error throw \'Cookie not signed\'', async () => {
    const mockRequest = {
      signedCookies: [],
    } as any;

    const key = 'auth';

    const { CookieService } = await import(
      '@security/services/cookie.service'
    );
    const instance = CookieService.instance(mockRequest, key);

    expect(() => instance.getCookieSigned()).toThrow(
      new Error('Cookie not signed')
    );
  });

  it('should getCookieSigned return success', async () => {
    const key = 'auth';
    const value_key = 'tokenteste-cookie';
    const mockRequest = {
      signedCookies: {
        [key]: value_key,
      },
    } as any;

    const { CookieService } = await import(
      '@security/services/cookie.service'
    );
    const instance = CookieService.instance( mockRequest, key);

    const response = instance.getCookieSigned();

    expect(response).toEqual(value_key);
  });

  it('should delete production', async () => {
    const NODE_ENV = 'production';
    const DOMAIN_API = 'http://localhost:8080';

    process.env.NODE_ENV = NODE_ENV;
    process.env.DOMAIN_API = DOMAIN_API;

    const key = 'auth';
    const mockRequest = {} as any;

    const mockResponse = {
      clearCookie: jest.fn(),
    } as any;
    const { CookieService } = await import(
      '@security/services/cookie.service'
    );
    const instance = CookieService.instance( mockRequest, key);

    instance.delete(mockResponse);

    expect(mockResponse.clearCookie).toHaveBeenNthCalledWith(1, key ,{
      path: '/',
      signed: true,
      sameSite: 'strict',
      domain: DOMAIN_API,
      secure: true
    });
  });
});
