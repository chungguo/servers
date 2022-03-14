import * as crypto from 'crypto';
import { Injectable } from "@nestjs/common";

@Injectable()
export class HelpersService {
  public sha1(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
  };
}
