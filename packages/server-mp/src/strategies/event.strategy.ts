import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageStrategies, SubscribeEvent } from 'src/typings/wechat';

@Injectable()
export class EventMessageReplyStrategy implements MessageStrategies {
  constructor(
    private config: ConfigService,
  ) { }

  async replyMessage(message: SubscribeEvent) {
    const { FromUserName, ToUserName } = message;

    return `<xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${new Date().getTime()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${this.config.get('MP_DEFAULT_TEXT_RESP')}]]></Content>
    </xml>`
  }
}
