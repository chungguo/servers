import { parseStringPromise } from 'xml2js';
import {
  Post,
  Query,
  Body,
  Header,
  HttpCode,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { MessageService } from "src/message/message.service";
import { EncryptService } from "src/encrypt/encrypt.service";
import { Message } from 'src/typings/wechat';
import { MessageQueryDTO, MessageBodyDTO } from 'src/message/message.dto';

@Controller('mp')
export class MessageController {
  constructor(
    private readonly service: MessageService,
    private readonly encrypt: EncryptService,
  ) { }

  @Post('wxauth')
  @HttpCode(200)
  @Header('Content-Type', 'application/xml')
  async message(
    @Query() messageQuery: MessageQueryDTO,
    @Body() messageBody: MessageBodyDTO,
  ) {
    const { xml: { Encrypt: encrypt } } = messageBody;
    const { timestamp, nonce, msg_signature: msgsignature } = messageQuery;

    const { genSign, decode, encode } = this.encrypt;

    const signature = genSign({ timestamp, nonce, encrypt });

    if (msgsignature !== signature) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    /** 解密消息体 */
    const decrypt = decode(encrypt);

    /** JSON 格式化消息体 */
    const jsonFormatedMessage = await parseStringPromise(decrypt, {
      explicitArray: false
    });

    const { xml: content } = jsonFormatedMessage as {
      xml: Message,
    };

    const resp = await this.service.handleMessage(content);

    /** 加密返回消息 */
    const encoded = encode(resp);

    /** 生成返回消息签名 */
    const replySignature = genSign({
      timestamp,
      nonce,
      encrypt: encoded
    });

    /** 拼接返回消息结构 */
    return `<xml>
      <Encrypt><![CDATA[${encoded}]]></Encrypt>
      <MsgSignature><![CDATA[${replySignature}]]></MsgSignature>
      <TimeStamp>${timestamp}</TimeStamp>
      <Nonce><![CDATA[${nonce}]]></Nonce>
    </xml>`;
  }
}
