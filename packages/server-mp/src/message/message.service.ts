import { Injectable } from "@nestjs/common";

import { Message, MessageTypeEnum } from 'src/typings/wechat';
import { TextMessageReplyStrategy } from 'src/strategies/text.strategy';
import { ImageMessageReplyStrategy } from 'src/strategies/image.strategy';
import { VoiceMessageReplyStrategy } from 'src/strategies/voice.strategy';

@Injectable()
export class MessageService {
  constructor(
    private readonly text: TextMessageReplyStrategy,
    private readonly image: ImageMessageReplyStrategy,
    private readonly voice: VoiceMessageReplyStrategy,
  ) { }

  strategies = {
    [MessageTypeEnum.Text]: this.text,
    [MessageTypeEnum.Image]: this.image,
    [MessageTypeEnum.Voice]: this.voice,
  }

  public async handleMessage(message: Message) {
    /* 解构出接收到的消息内容 */
    const { MsgType } = message;

    const strategy = this.strategies[MsgType];

    if (strategy) {
      const reply = await strategy.replyMessage(message);
      return reply;
    }

    return '';
  }
}
