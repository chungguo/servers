import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HelpersService } from 'src/helpers/helpers.service';

import { VoiceMessage, MessageStrategies } from 'src/typings/wechat';

@Injectable()
export class VoiceMessageReplyStrategy implements MessageStrategies {
  constructor(
    private config: ConfigService,
    private helpers: HelpersService,
  ) { }

  async replyMessage(message: VoiceMessage) {
    const { FromUserName, ToUserName, Recognition, MsgId } = message;

    let reply = this.config.get('MP_DEFAULT_TEXT_RESP');;

    if (!Recognition) {
      reply = '对不起🧎‍♂️，暂时无法识别该条语音消息内容';
    } else {
      /** 去除语音识别出的符号  */
      const keyword = Recognition.replace(/[.,。，？?!@#$%^&*()+_《》。〉]/g, '');
      const matched = await this.helpers.matchReplyKeyWord(keyword);
      reply = matched ?? `对不起，未匹配到「${Recognition}」相关信息～`
    }

    return `<xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${new Date().getTime()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${reply}]]></Content>
      <MsgId>${MsgId}</MsgId>
    </xml>`
  }
}
