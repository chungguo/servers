import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelpersService } from 'src/helpers/helpers.service';

import { TextMessage, MessageStrategies } from 'src/typings/wechat';

@Injectable()
export class TextMessageReplyStrategy implements MessageStrategies {
  constructor(
    private config: ConfigService,
    private helpers: HelpersService,
  ) { }

  async replyMessage(message: TextMessage) {
    const { Content, FromUserName, ToUserName } = message;
    const matched = await this.helpers.matchReplyKeyWord(Content);
    const reply = matched ?? this.config.get('MP_DEFAULT_TEXT_RESP');

    return `<xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${new Date().getTime()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${reply}]]></Content>
    </xml>`;
  }
}
