import * as crypto from 'crypto';
import { Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Reply, ReplyDocument } from 'src/strategies/schemas/reply.schema';

@Injectable()
export class HelpersService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<ReplyDocument>
  ) { }

  public sha1(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
  };

  public async matchReplyKeyWord(keyword: string) {
    const collections = await this.replyModel.find().exec();

    for (const collect of collections) {
      if (collect.keywords.includes(keyword)) {
        return collect.message;
      }
    }

    return null;
  }
}
