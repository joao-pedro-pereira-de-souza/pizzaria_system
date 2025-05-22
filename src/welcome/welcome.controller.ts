import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

export class WelcomeController {
  async execute(
    req: Request< any, any, any,any>,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {

      const pathHtml = path.resolve(
        __dirname,
        '../',
        'view',
        'pages',
        'welcome.page.html'
      );
      const readFile = fs.readFileSync(pathHtml);

      res.set('Content-Type', 'text/html');
      res.send(readFile);
    } catch (error) {
      next(error);
    }
  }
}
