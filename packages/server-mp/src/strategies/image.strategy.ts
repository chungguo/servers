import { Injectable } from '@nestjs/common';
import { ImageMessage, MessageStrategies } from 'src/typings/wechat';

@Injectable()
export class ImageMessageReplyStrategy implements MessageStrategies {
  async replyMessage(message: ImageMessage) {
    const { FromUserName, ToUserName, MsgId } = message;

    return `<xml>
      <ToUserName><![CDATA[${FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${ToUserName}]]></FromUserName>
      <CreateTime>${new Date().getTime()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[对不起🧎‍♂️，暂时无法识别图片信息]]></Content>
      <MsgId>${MsgId}</MsgId>
    </xml>`;
  }
}
