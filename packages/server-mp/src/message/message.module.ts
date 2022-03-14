import { Module } from '@nestjs/common';
import { MessageController } from 'src/message/message.controller';
import { MessageService } from 'src/message/message.service';
import { EncryptModule } from 'src/encrypt/encrypt.module';
import { StrategiesModule } from 'src/strategies/strategies.module';

@Module({
  imports: [
    EncryptModule,
    StrategiesModule,
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
  ],
})
export class MessageModule { }
