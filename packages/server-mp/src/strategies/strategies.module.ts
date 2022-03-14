import { Module } from "@nestjs/common";

import { HelpersModule } from "src/helpers/helpers.module";
import { TextMessageReplyStrategy } from 'src/strategies/text.strategy';
import { ImageMessageReplyStrategy } from 'src/strategies/image.strategy';
import { VoiceMessageReplyStrategy } from 'src/strategies/voice.strategy';
import { EventMessageReplyStrategy } from 'src/strategies/event.strategy';

@Module({
  imports: [
    HelpersModule,
  ],
  providers: [
    TextMessageReplyStrategy,
    ImageMessageReplyStrategy,
    VoiceMessageReplyStrategy,
    EventMessageReplyStrategy,
  ],
  exports: [
    TextMessageReplyStrategy,
    ImageMessageReplyStrategy,
    VoiceMessageReplyStrategy,
    EventMessageReplyStrategy,
  ],
})
export class StrategiesModule { }
