import * as bodyParser from 'body-parser';
import bodyParserXml = require('body-parser-xml');
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class XmlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    bodyParserXml(bodyParser);

    bodyParser.xml({
      xmlParseOptions: {
        explicitArray: false,
      },
    })(req, res, next);
  }
}
