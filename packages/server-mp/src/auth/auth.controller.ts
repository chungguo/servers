import { Controller, Get, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { HelpersService } from "src/helpers/helpers.service";
import { AuthDTO } from 'src/auth/auth.dto';

@Controller('mp')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly helper: HelpersService,
  ) { }

  @Get('wxauth')
  wxCheck(@Query() wxAuthDTO: AuthDTO) {
    const { signature, timestamp, nonce, echostr } = wxAuthDTO;
    const token = this.config.get('MP_TOKEN');
    const str = [nonce, timestamp, token].sort().join('');
    const hash = this.helper.sha1(str);
    return hash === signature ? echostr : false;
  }
}
