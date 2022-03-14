import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';

import { ReplySchema, Reply } from 'src/strategies/schemas/reply.schema';
import { TextMessageStrategy } from 'src/strategies/text.strategy';
import { ImageMessageStrategy } from 'src/strategies/image.strategy';
import { VoiceMessageStrategy } from 'src/strategies/voice.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reply.name,
        schema: ReplySchema,
      }
    ])
  ],
  providers: [
    TextMessageStrategy,
    ImageMessageStrategy,
    VoiceMessageStrategy,
  ],
  exports: [
    TextMessageStrategy,
    ImageMessageStrategy,
    VoiceMessageStrategy,
  ],
})
export class StrategiesModule {}
