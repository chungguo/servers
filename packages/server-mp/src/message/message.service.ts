import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Message, MessageTypeEnum } from 'src/typings/wechat';
import { TextMessageReplyStrategy } from 'src/strategies/text.strategy';
import { ImageMessageReplyStrategy } from 'src/strategies/image.strategy';
import { VoiceMessageReplyStrategy } from 'src/strategies/voice.strategy';
import { EventMessageReplyStrategy } from 'src/strategies/event.strategy';

@Injectable()
export class MessageService {
  constructor(
    private readonly config: ConfigService,
    private readonly text: TextMessageReplyStrategy,
    private readonly image: ImageMessageReplyStrategy,
    private readonly voice: VoiceMessageReplyStrategy,
    private readonly event: EventMessageReplyStrategy,
  ) { }

  strategies = {
    [MessageTypeEnum.Text]: this.text,
    [MessageTypeEnum.Image]: this.image,
    [MessageTypeEnum.Voice]: this.voice,
    [MessageTypeEnum.Event]: this.event,
  }

  public async handleMessage(message: Message) {
    /* 解构出接收到的消息内容 */
    const { MsgType, FromUserName, ToUserName } = message;

    const strategy = this.strategies[MsgType];

    if (strategy) {
      const reply = await strategy.replyMessage(message);
      return reply;
    }

    return `<xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${new Date().getTime()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[暂不支持该类型消息，${this.config.get('MP_DEFAULT_TEXT_RESP')}]]></Content>
    </xml>`;
  }
}
