import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

import { Message, MessageTypeEnum } from 'src/typings/wechat';
import { TextMessageStrategy } from 'src/strategies/text.strategy';
import { ImageMessageStrategy } from 'src/strategies/image.strategy';
import { VoiceMessageStrategy } from 'src/strategies/voice.strategy';

@Injectable()
export class MessageService {
  constructor(
    private readonly config: ConfigService,
    private readonly text: TextMessageStrategy,
    private readonly image: ImageMessageStrategy,
    private readonly voice: VoiceMessageStrategy,
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
      const reply = await strategy.buildMessage(message);
      return reply;
    }

    return '';
  }
}
