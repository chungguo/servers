import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

export class MessageQueryDTO {
  @IsString()
  timestamp: string;

  @IsString()
  nonce: string;

  @IsString()
  msg_signature: string;
}

class MessageBodyXML {
  @IsString()
  Encrypt: string;

  @IsString()
  ToUserName: string;
}

export class MessageBodyDTO {
  @ValidateNested()
  @Type(() => MessageBodyXML)
  xml: MessageBodyXML;
}
