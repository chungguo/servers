import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReplyDocument = Reply & Document;

@Schema({ collection: 'reply' })
export class Reply {
  @Prop()
  keywords: string[];

  @Prop()
  message: string;

  @Prop()
  type: "text" | "news";
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
