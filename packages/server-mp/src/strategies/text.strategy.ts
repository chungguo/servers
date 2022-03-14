import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TextMessage, MessageStrategies } from 'src/typings/wechat';
import { Reply, ReplyDocument } from 'src/strategies/schemas/reply.schema';

@Injectable()
export class TextMessageStrategy implements MessageStrategies {
  constructor(
    private config: ConfigService,
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>
  ) { }

  async buildMessage(message: TextMessage) {
    const { Content, FromUserName, ToUserName, MsgId } = message;
    let reply = this.config.get('MP_DEFAULT_TEXT_RESP');

    const collections = await this.replyModel.find().exec();

    for (const collect of collections) {
      if (collect.keywords.includes(Content)) {
        reply = collect.message;
        break;
      }
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
